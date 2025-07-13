
import type { Tables, Enums } from '@/integrations/supabase/types';

type QuestionType = Enums<'question_type'>;

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Business' | 'Education' | 'Technical' | 'Community';
  icon: string;
  form: {
    title: string;
    description: string;
    allow_anonymous: boolean;
    collect_email: boolean;
  };
  questions: Array<{
    type: QuestionType;
    title: string;
    description: string;
    required: boolean;
    options?: string[];
  }>;
}

export const formTemplates: FormTemplate[] = [
  {
    id: 'quick-quiz',
    name: 'Quick Quiz',
    description: 'A short form with multiple-choice questions to test knowledge, useful for teachers, trainers, or fun learning games.',
    category: 'Education',
    icon: '🧠',
    form: {
      title: 'Quick Quiz',
      description: 'Test your knowledge with this quick quiz',
      allow_anonymous: true,
      collect_email: false,
    },
    questions: [
      {
        type: 'multiple_choice',
        title: 'What is the capital of France?',
        description: 'Select the correct answer',
        required: true,
        options: ['London', 'Berlin', 'Paris', 'Madrid']
      },
      {
        type: 'multiple_choice',
        title: 'Which planet is known as the Red Planet?',
        description: 'Choose the correct option',
        required: true,
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn']
      },
      {
        type: 'rating',
        title: 'How difficult was this quiz?',
        description: 'Rate from 1 (very easy) to 5 (very hard)',
        required: false,
      }
    ]
  },
  {
    id: 'customer-feedback',
    name: 'Customer Feedback',
    description: 'A form with rating scales, short answers, and suggestion fields to collect opinions about products, services, or experiences.',
    category: 'Business',
    icon: '⭐',
    form: {
      title: 'Customer Feedback',
      description: 'Help us improve by sharing your feedback',
      allow_anonymous: true,
      collect_email: true,
    },
    questions: [
      {
        type: 'rating',
        title: 'How satisfied are you with our product/service?',
        description: 'Rate from 1 (very unsatisfied) to 5 (very satisfied)',
        required: true,
      },
      {
        type: 'multiple_choice',
        title: 'How likely are you to recommend us to others?',
        description: 'Select your likelihood',
        required: true,
        options: ['Very likely', 'Likely', 'Neutral', 'Unlikely', 'Very unlikely']
      },
      {
        type: 'textarea',
        title: 'What did you like most about our product/service?',
        description: 'Please share your positive experience',
        required: false,
      },
      {
        type: 'textarea',
        title: 'What could we improve?',
        description: 'Your suggestions help us get better',
        required: false,
      }
    ]
  },
  {
    id: 'event-registration',
    name: 'Event Registration',
    description: 'A sign-up form to collect names, emails, preferences, and availability for online or offline events like webinars, workshops, or conferences.',
    category: 'Education',
    icon: '📅',
    form: {
      title: 'Event Registration',
      description: 'Register for our upcoming event',
      allow_anonymous: false,
      collect_email: true,
    },
    questions: [
      {
        type: 'text',
        title: 'Full Name',
        description: 'Enter your full name',
        required: true,
      },
      {
        type: 'text',
        title: 'Job Title',
        description: 'Your current position',
        required: false,
      },
      {
        type: 'text',
        title: 'Company/Organization',
        description: 'Where do you work?',
        required: false,
      },
      {
        type: 'dropdown',
        title: 'How did you hear about this event?',
        description: 'Select the source',
        required: true,
        options: ['Social Media', 'Email Newsletter', 'Website', 'Word of mouth', 'Other']
      },
      {
        type: 'checkbox',
        title: 'Which topics interest you most?',
        description: 'Select all that apply',
        required: false,
        options: ['Technology', 'Business Strategy', 'Marketing', 'Design', 'Leadership']
      },
      {
        type: 'textarea',
        title: 'Any special requirements or questions?',
        description: 'Let us know if you need any accommodations',
        required: false,
      }
    ]
  },
  {
    id: 'job-application',
    name: 'Job Application',
    description: 'A detailed form with inputs for name, email, resume upload, experience, and qualifications — useful for companies collecting applications.',
    category: 'Technical',
    icon: '💼',
    form: {
      title: 'Job Application',
      description: 'Apply for a position at our company',
      allow_anonymous: false,
      collect_email: true,
    },
    questions: [
      {
        type: 'text',
        title: 'Full Name',
        description: 'Enter your full legal name',
        required: true,
      },
      {
        type: 'text',
        title: 'Phone Number',
        description: 'Your contact number',
        required: true,
      },
      {
        type: 'text',
        title: 'LinkedIn Profile',
        description: 'Your LinkedIn URL (optional)',
        required: false,
      },
      {
        type: 'dropdown',
        title: 'Position Applied For',
        description: 'Select the role you are applying for',
        required: true,
        options: ['Software Engineer', 'Product Manager', 'Designer', 'Marketing Specialist', 'Sales Representative']
      },
      {
        type: 'number',
        title: 'Years of Experience',
        description: 'Total years of relevant work experience',
        required: true,
      },
      {
        type: 'textarea',
        title: 'Why do you want to work with us?',
        description: 'Tell us what motivates you to join our team',
        required: true,
      },
      {
        type: 'textarea',
        title: 'Relevant Skills and Experience',
        description: 'Describe your key skills and achievements',
        required: true,
      }
    ]
  },
  {
    id: 'contact-us',
    name: 'Contact Us',
    description: 'A simple form with name, email, subject, and message fields so users can easily reach out with questions, feedback, or support requests.',
    category: 'Business',
    icon: '📧',
    form: {
      title: 'Contact Us',
      description: 'Get in touch with us - we would love to hear from you',
      allow_anonymous: true,
      collect_email: true,
    },
    questions: [
      {
        type: 'text',
        title: 'Your Name',
        description: 'How should we address you?',
        required: true,
      },
      {
        type: 'dropdown',
        title: 'Subject',
        description: 'What is this message about?',
        required: true,
        options: ['General Inquiry', 'Support Request', 'Feedback', 'Partnership', 'Other']
      },
      {
        type: 'textarea',
        title: 'Message',
        description: 'Please describe your inquiry in detail',
        required: true,
      },
      {
        type: 'dropdown',
        title: 'Preferred Response Method',
        description: 'How would you like us to respond?',
        required: false,
        options: ['Email', 'Phone Call', 'No response needed']
      }
    ]
  },
  {
    id: 'course-feedback',
    name: 'Course Feedback',
    description: 'A form with Likert scale questions (Strongly Agree to Strongly Disagree) and open-ended fields to collect student feedback after a course or session.',
    category: 'Education',
    icon: '🎓',
    form: {
      title: 'Course Feedback',
      description: 'Help us improve our course by sharing your feedback',
      allow_anonymous: true,
      collect_email: false,
    },
    questions: [
      {
        type: 'text',
        title: 'Course Name',
        description: 'Which course are you providing feedback for?',
        required: true,
      },
      {
        type: 'multiple_choice',
        title: 'The course content was well organized and easy to follow',
        description: 'Select your level of agreement',
        required: true,
        options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']
      },
      {
        type: 'multiple_choice',
        title: 'The instructor was knowledgeable and helpful',
        description: 'Select your level of agreement',
        required: true,
        options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']
      },
      {
        type: 'multiple_choice',
        title: 'The course materials were useful and relevant',
        description: 'Select your level of agreement',
        required: true,
        options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']
      },
      {
        type: 'rating',
        title: 'Overall, how would you rate this course?',
        description: 'Rate from 1 (poor) to 5 (excellent)',
        required: true,
      },
      {
        type: 'textarea',
        title: 'What did you like most about the course?',
        description: 'Share the highlights',
        required: false,
      },
      {
        type: 'textarea',
        title: 'What suggestions do you have for improvement?',
        description: 'Help us make the course better',
        required: false,
      }
    ]
  },
  {
    id: 'poll-voting',
    name: 'Poll / Voting',
    description: 'A quick one-question form with radio buttons or checkboxes, allowing users to vote or express opinions with a single click.',
    category: 'Community',
    icon: '🗳️',
    form: {
      title: 'Quick Poll',
      description: 'Share your opinion - every vote counts!',
      allow_anonymous: true,
      collect_email: false,
    },
    questions: [
      {
        type: 'multiple_choice',
        title: 'What is your preferred meeting time for our team events?',
        description: 'Select the option that works best for you',
        required: true,
        options: ['Morning (9-11 AM)', 'Lunch time (12-1 PM)', 'Afternoon (2-4 PM)', 'Evening (5-7 PM)']
      }
    ]
  },
  {
    id: 'bug-report',
    name: 'Bug Report',
    description: 'A structured form for users to report issues, with fields like bug title, steps to reproduce, expected vs actual behavior, and optional screenshot upload.',
    category: 'Technical',
    icon: '🐛',
    form: {
      title: 'Bug Report',
      description: 'Help us fix issues by reporting bugs you encounter',
      allow_anonymous: true,
      collect_email: true,
    },
    questions: [
      {
        type: 'text',
        title: 'Bug Title',
        description: 'A brief, descriptive title for the bug',
        required: true,
      },
      {
        type: 'dropdown',
        title: 'Priority Level',
        description: 'How critical is this bug?',
        required: true,
        options: ['Low', 'Medium', 'High', 'Critical']
      },
      {
        type: 'dropdown',
        title: 'Bug Category',
        description: 'What type of issue is this?',
        required: true,
        options: ['UI/UX Issue', 'Functionality Problem', 'Performance Issue', 'Data Problem', 'Other']
      },
      {
        type: 'textarea',
        title: 'Steps to Reproduce',
        description: 'Detailed steps to recreate the bug',
        required: true,
      },
      {
        type: 'textarea',
        title: 'Expected Behavior',
        description: 'What should have happened?',
        required: true,
      },
      {
        type: 'textarea',
        title: 'Actual Behavior',
        description: 'What actually happened instead?',
        required: true,
      },
      {
        type: 'text',
        title: 'Browser/Device Information',
        description: 'Which browser and device were you using?',
        required: false,
      }
    ]
  },
  {
    id: 'newsletter-signup',
    name: 'Newsletter Signup',
    description: 'A minimal form with just name and email input, letting users subscribe to updates, announcements, or newsletters.',
    category: 'Business',
    icon: '📮',
    form: {
      title: 'Newsletter Signup',
      description: 'Stay updated with our latest news and updates',
      allow_anonymous: false,
      collect_email: true,
    },
    questions: [
      {
        type: 'text',
        title: 'First Name',
        description: 'Your first name',
        required: true,
      },
      {
        type: 'checkbox',
        title: 'What topics interest you?',
        description: 'Select all that apply',
        required: false,
        options: ['Product Updates', 'Industry News', 'Tips & Tutorials', 'Company News', 'Special Offers']
      },
      {
        type: 'dropdown',
        title: 'How often would you like to hear from us?',
        description: 'Choose your preferred frequency',
        required: false,
        options: ['Daily', 'Weekly', 'Monthly', 'Only for important updates']
      }
    ]
  },
  {
    id: 'volunteer-signup',
    name: 'Volunteer Signup',
    description: 'A form to gather volunteers for an event or campaign, with inputs for name, contact, skills, and availability.',
    category: 'Community',
    icon: '🤝',
    form: {
      title: 'Volunteer Signup',
      description: 'Join our team of volunteers and make a difference!',
      allow_anonymous: false,
      collect_email: true,
    },
    questions: [
      {
        type: 'text',
        title: 'Full Name',
        description: 'Your complete name',
        required: true,
      },
      {
        type: 'text',
        title: 'Phone Number',
        description: 'Your contact number',
        required: true,
      },
      {
        type: 'number',
        title: 'Age',
        description: 'Your age (required for some activities)',
        required: false,
      },
      {
        type: 'checkbox',
        title: 'What skills can you contribute?',
        description: 'Select all that apply',
        required: false,
        options: ['Event Planning', 'Social Media', 'Photography', 'Writing', 'Technical Support', 'Fundraising', 'Teaching/Training', 'Other']
      },
      {
        type: 'checkbox',
        title: 'When are you available?',
        description: 'Select your available time slots',
        required: true,
        options: ['Weekday Mornings', 'Weekday Afternoons', 'Weekday Evenings', 'Weekend Mornings', 'Weekend Afternoons', 'Weekend Evenings']
      },
      {
        type: 'textarea',
        title: 'Why do you want to volunteer?',
        description: 'Tell us about your motivation',
        required: false,
      },
      {
        type: 'textarea',
        title: 'Previous volunteer experience',
        description: 'Share any relevant experience (optional)',
        required: false,
      }
    ]
  }
];

export const templateCategories = ['Business', 'Education', 'Technical', 'Community'] as const;
