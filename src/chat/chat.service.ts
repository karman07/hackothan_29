import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChatService {
  private readonly websiteContext = `
You are a helpful assistant for EduVerify, a government-backed AI-powered platform for academic credential verification.

Key information about EduVerify:
- We help verify educational certificates and detect document fraud
- We use AI technology trusted by institutions and employers
- We serve the Jharkhand region
- We have pages for: Home, Team, Contact, and Verifier tool

Available actions you can suggest:
- Direct users to /contact for contact information
- Direct users to /team to learn about our team
- Direct users to /app for certificate verification
- Direct users to / for the home page

Always be helpful, professional, and focused on EduVerify's services.
`;

  private readonly localResponses = [
    {
      keywords: ['team', 'members', 'who', 'staff'],
      response:
        'Our team consists of dedicated professionals working to combat educational certificate fraud. You can learn more about our team members on our Team page. Would you like me to take you there?',
    },
    {
      keywords: ['contact', 'reach', 'phone', 'email', 'address'],
      response:
        'You can reach us through our Contact page where you\'ll find all our contact details. I can redirect you there if you\'d like.',
    },
    {
      keywords: ['verify', 'certificate', 'document', 'check', 'validation'],
      response:
        'Our Verifier tool uses advanced AI to check the authenticity of educational certificates. You can upload your certificate there for verification. Shall I take you to the verification page?',
    },
    {
      keywords: ['fraud', 'fake', 'authentic', 'security'],
      response:
        'We use government-backed AI technology to detect document fraud and ensure certificate authenticity. Our system is trusted by institutions across Jharkhand.',
    },
    {
      keywords: ['how', 'work', 'process'],
      response:
        'EduVerify works by analyzing uploaded certificates using AI algorithms to detect signs of forgery or tampering. The process is quick, secure, and reliable.',
    },
  ];

  constructor(private readonly httpService: HttpService) {}

  private findLocalResponse(message: string): string | null {
    const lowerMessage = message.toLowerCase();
    for (const item of this.localResponses) {
      if (item.keywords.some((kw) => lowerMessage.includes(kw))) {
        return item.response;
      }
    }
    return null;
  }

  async getReply(message: string): Promise<string> {
    if (!message || typeof message !== 'string') {
      throw new HttpException('Please provide a valid message.', 400);
    }

    // First check local responses
    const local = this.findLocalResponse(message);
    if (local) return local;

    // If HuggingFace API is configured, use it
    if (process.env.HF_API_KEY) {
      try {
        const contextualPrompt = `${this.websiteContext}\n\nUser question: ${message}\n\nResponse:`;

        const response = await firstValueFrom(
          this.httpService.post(
            'https://api-inference.huggingface.co/models/google/flan-t5-large',
            {
              inputs: contextualPrompt,
              parameters: {
                max_new_tokens: 150,
                temperature: 0.7,
                do_sample: true,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.HF_API_KEY}`,
                'Content-Type': 'application/json',
              },
            },
          ),
        );

        const data = response.data;
        let reply =
          data[0]?.generated_text ||
          "I'm here to help with EduVerify. Ask me about our team, contact info, or certificate verification.";

        reply = reply.replace(contextualPrompt, '').trim();
        return reply;
      } catch (err) {
        console.error('HuggingFace API Error:', err.message);
        return this.randomFallback();
      }
    }

    // No API key fallback
    return 'I can help you with information about EduVerify. Ask me about our team, contact details, certificate verification, or how our platform works.';
  }

  private randomFallback(): string {
    const fallback = [
      "I'm here to help with EduVerify! Ask me about our team, contact information, or certificate verification.",
      'I can assist you with information about our platform. What would you like to know about EduVerify?',
      'How can I help you today? I can provide information about our team, services, or verification process.',
    ];
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
}
