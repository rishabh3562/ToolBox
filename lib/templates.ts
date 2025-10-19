import { Template } from "@/types";

export const defaultTemplates: Template[] = [
  {
    id: "blog-intro",
    name: "Blog Introduction",
    category: "blog",
    content: `As a {{role}}, I've spent considerable time {{experience}}. You can find more of my work at {{portfolio_url}}.

Connect with me on {{linkedin_url}} to discuss more about {{expertise}}.`,
  },
  {
    id: "email-intro",
    name: "Professional Introduction",
    category: "email",
    content: `Hi {{name}},

I hope this email finds you well. I'm {{your_name}}, a {{role}} with expertise in {{expertise}}. 

I'd love to discuss how I can help with {{project_type}}. You can check out my previous work at {{portfolio_url}}.

Best regards,
{{your_name}}`,
  },
  {
    id: "tompate-reply",
    name: "Tompate Reply",
    category: "email",
    content: `Subject: Thank You for Your Interest – How Can I Help You?

Hi {{client_name}},

I noticed that you recently accessed my service through Topmate. Thank you for checking it out! 🙌

I’d love to learn more about your needs and how I can assist you. Whether you're looking for help with:

Improving your website’s design or performance,
Optimizing it for better SEO and faster loading times, or
Building a brand-new website from scratch,
I’m here to help!

Feel free to reply to this email with a brief description of your project or any questions you might have. We can also set up a quick call to discuss your requirements and see how we can work together to achieve your goals. You can book a time directly through my Calendly link.

To learn more about my work, feel free to check out my {{portfolio_url}}, {{linkedin_url}}, or {{github_url}}.

Looking forward to hearing from you!

Best regards,
{{your_name}}
Freelance Web Developer
{{portfolio_url}} | {{linkedin_url}} | {{topmate_url}} | {{cal_url}}`,
  },
];
