import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { contactSchema, type ContactFormData } from '../../lib/validators';
import { ArrowRight, CheckCircle2, ShieldCheck, Lock, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactData, setContactData] = useState<ContactFormData>({ name: '', email: '', message: '' });
  const [contactErrors, setContactErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const { toast } = useToast();

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(contactData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
        }
      });
      setContactErrors(fieldErrors);
      return;
    }

    setContactErrors({});
    setIsSubmittingContact(true);

    setTimeout(() => {
      setIsSubmittingContact(false);
      setContactSent(true);
      toast('Message received. I will reply within a few hours.', 'success');
      setTimeout(() => {
        setContactModalOpen(false);
        setContactSent(false);
        setContactData({ name: '', email: '', message: '' });
      }, 2000);
    }, 800);
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.includes('@')) {
      toast('Please enter a valid email address', 'error');
      return;
    }
    setNewsletterSubscribed(true);
    toast('You are on the list.', 'success');
  };

  return (
    <>
      <footer className="bg-[#1B251F] text-[#F6F2EC] pt-20 pb-12 mt-16 border-t border-[#26332C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Closing Proposal Banner */}
          <div className="border-b border-[#2C3B32] pb-14 mb-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B5654A] font-semibold block mb-2">
                Launch Ready in 10 Days
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight tracking-[-0.015em] text-[#F6F2EC]">
                Ship on day ten, not day eleven.
              </h2>
              <p className="text-[#C9C0B2] text-sm sm:text-base mt-3 leading-relaxed">
                Core card checkout operational in 2 to 3 days. Wallets right after. Built with zero trust in client pricing.
              </p>
            </div>

            <Button
              variant="secondary"
              size="lg"
              className="bg-[#F6F2EC] text-[#1E1B18] hover:bg-[#E9E2D6] shrink-0 font-medium px-6"
              onClick={() => setContactModalOpen(true)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start the Conversation
            </Button>
          </div>

          {/* Links & Newsletter Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-14 text-xs">
            {/* Col 1 */}
            <div>
              <h4 className="uppercase font-mono tracking-widest text-[#9A958B] mb-4 text-[11px] font-semibold">
                Collection
              </h4>
              <ul className="space-y-2.5 text-[#E6E2DA]">
                <li><Link to="/shop" className="hover:text-white transition-colors">Outerwear</Link></li>
                <li><Link to="/shop" className="hover:text-white transition-colors">Tailoring</Link></li>
                <li><Link to="/shop" className="hover:text-white transition-colors">Knitwear</Link></li>
                <li><Link to="/shop" className="hover:text-white transition-colors">Shirting</Link></li>
                <li><Link to="/shop" className="hover:text-white transition-colors">Accessories</Link></li>
              </ul>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="uppercase font-mono tracking-widest text-[#9A958B] mb-4 text-[11px] font-semibold">
                Architecture
              </h4>
              <ul className="space-y-2.5 text-[#E6E2DA]">
                <li><Link to="/proposal" className="hover:text-white transition-colors">Delivery Plan</Link></li>
                <li><Link to="/checkout" className="hover:text-white transition-colors">Checkout Demo</Link></li>
                <li><a href="/#failure-lab-anchor" className="hover:text-white transition-colors">Failure Lab</a></li>
                <li><a href="/#architecture-story" className="hover:text-white transition-colors">Data Flow</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="uppercase font-mono tracking-widest text-[#9A958B] mb-4 text-[11px] font-semibold">
                Engineering
              </h4>
              <ul className="space-y-2.5 text-[#E6E2DA]">
                <li className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-[#4353FF]" /> Webflow Storefront</li>
                <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> BigCommerce V3 Engine</li>
                <li className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-[#635BFF]" /> Stripe 3DS / SCA</li>
                <li className="flex items-center gap-1.5"><span className="w-3 h-3 text-hood-accent font-bold">▲</span> Vercel Serverless</li>
              </ul>
            </div>

            {/* Col 4 & 5: Newsletter */}
            <div className="col-span-2">
              <h4 className="uppercase font-mono tracking-widest text-[#9A958B] mb-4 text-[11px] font-semibold">
                Studio Dispatch
              </h4>
              <p className="text-[#C9C0B2] mb-3 text-xs leading-relaxed">
                Private release notices for small production batches and technical updates.
              </p>

              {newsletterSubscribed ? (
                <div className="p-3 bg-[#26332C] rounded-xs border border-[#3E5F78]/40 flex items-center gap-2 text-white text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>You are on the list.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="bg-[#26332C] text-[#F6F2EC] placeholder:text-[#9A958B] px-3.5 py-2.5 text-xs rounded-xs border border-[#3A4A3F] focus:outline-none focus:ring-1 focus:ring-[#B5654A] flex-1"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#F6F2EC] text-[#1E1B18] text-xs font-medium rounded-xs hover:bg-[#E9E2D6] transition-colors shrink-0"
                  >
                    Join
                  </button>
                </form>
              )}

              <p className="text-[11px] text-[#9A958B] mt-3 font-mono">
                Demo store. No real payments are taken.
              </p>
            </div>
          </div>

          {/* Clean Bottom Brand Row */}
          <div className="pt-8 border-t border-[#2C3B32] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9A958B]">
            <div className="flex items-center gap-3">
              <span className="font-serif text-lg text-[#F6F2EC] lowercase tracking-wider">
                linden row
              </span>
              <span>·</span>
              <span className="font-mono text-[11px]">Considered wardrobe staples.</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span>Single source of truth: BigCommerce</span>
              <span>·</span>
              <span>Payments: Stripe</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Proposal Modal */}
      <Modal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        title="Start the Conversation"
        description="Let's align on your launch schedule and technical requirements."
        maxWidth="md"
      >
        {contactSent ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-success mx-auto" />
            <h4 className="font-serif text-xl text-ink">Thanks. I will reply within a few hours.</h4>
            <p className="text-xs text-ink-muted">Your message has been received.</p>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-3 pt-2">
            <FormField
              label="Your Name"
              placeholder="e.g. Sarah Jenkins"
              value={contactData.name}
              onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
              error={contactErrors.name}
              required
            />
            <FormField
              label="Work Email"
              type="email"
              placeholder="sarah@yourbrand.com"
              value={contactData.email}
              onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
              error={contactErrors.email}
              required
            />
            <div>
              <label htmlFor="contact-message-input" className="text-xs font-medium uppercase tracking-[0.08em] text-ink-2 mb-1.5 block">
                Project Notes <span className="text-accent">*</span>
              </label>
              <textarea
                id="contact-message-input"
                rows={3}
                placeholder="Target launch date, current Webflow status, or any specific questions..."
                value={contactData.message}
                onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                className={`w-full bg-surface-elevated text-ink px-3.5 py-2.5 rounded-sm border text-sm focus:outline-none focus:ring-2 focus:ring-info ${
                  contactErrors.message ? 'border-error ring-1 ring-error' : 'border-border hover:border-border-strong'
                }`}
              />
              {contactErrors.message && (
                <p className="text-xs text-error mt-1">{contactErrors.message}</p>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setContactModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmittingContact}
              >
                Send Message
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};
