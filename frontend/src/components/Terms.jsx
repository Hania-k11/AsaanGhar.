/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, FileText, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

// --- Raw content data (no HTML or markdown tags) ---
const rawTermsContent = [
  {
    id: 'intro',
    title: '',
    content: `Welcome to Asaan Ghar ("we," "us," or "our"). These Terms and Conditions constitute a legally binding agreement that governs your use of our website, services, and applications. By accessing or using the Service, you confirm that you have read, understood, and agree to be bound by these terms. If you do not agree, you are not authorized to use our Service.`,
  },
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: `Your use of the Asaan Ghar platform, whether as a guest or a registered user, signifies your unconditional acceptance of these Terms and Conditions. These terms, along with our Privacy Policy, form a complete legal agreement between you and Asaan Ghar. We may update these terms periodically, and your continued use of the service after such changes means you accept the new terms.`,
  },
  {
    id: 'user-accounts',
    title: '2. User Accounts & Responsibilities',
    content: `To access certain features of the Service, you must create and maintain an active account. You are solely responsible for:
- Providing Accurate Information: You agree to provide and maintain accurate, current, and complete information during the registration process.
- Account Security: You are responsible for safeguarding your password and any other credentials. You must immediately notify us of any unauthorized use of your account.
- Account Activity: You are liable for all activities that occur under your account, whether or not you have authorized them.
We reserve the right to suspend or terminate your account at our discretion if any information provided is found to be false, inaccurate, or in violation of these terms.`,
  },
  {
    id: 'listings',
    title: '3. Property Listings & User Content',
    content: `Asaan Ghar is a platform for property listings. Users who post listings ("Listers") are entirely responsible for their content. By posting a listing, you warrant that:
- Legal Rights: You have the legal authority and right to advertise the property.
- Accuracy: All information, including property descriptions, photos, and pricing, is true, accurate, and not misleading.
- Intellectual Property: Your content does not infringe on any third-party rights, including copyright, trademark, or privacy rights.
Asaan Ghar acts purely as an intermediary and is not responsible for the accuracy of listings or the conduct of listers or potential buyers. We have the right, but not the obligation, to review and remove any content that we believe violates our policies.`,
  },
  {
    id: 'conduct',
    title: '4. Prohibited Activities',
    content: `You agree not to engage in the following activities while using the Service:
- Using the Service for any illegal or fraudulent purpose.
- Harassing, threatening, or impersonating other users.
- Distributing unsolicited messages, junk mail, or spam.
- Attempting to interfere with the integrity or security of the Service.
- Scraping, crawling, or otherwise collecting data from the Service without express written permission.`,
  },
  {
    id: 'ip',
    title: '5. Intellectual Property',
    content: `All intellectual property rights related to the Service, including the Asaan Ghar logo, design, text, graphics, and software, are the exclusive property of Asaan Ghar or its licensors. You may not use, reproduce, or distribute any part of our intellectual property without our prior written consent.`,
  },
  {
    id: 'warranty',
    title: '6. Disclaimer of Warranties & Limitation of Liability',
    content: `The Service is provided on an "as is" and "as available" basis. Asaan Ghar makes no warranties, express or implied, regarding the Service's reliability, accuracy, or security.
To the fullest extent permitted by law, Asaan Ghar, its officers, and employees will not be liable for any direct, indirect, incidental, special, or consequential damages, including loss of profits, data, or goodwill, arising from your use of or inability to use the Service.`,
  },
  {
    id: 'indemnify',
    title: '7. Indemnification',
    content: `You agree to indemnify and hold harmless Asaan Ghar, its affiliates, and their respective directors, officers, employees, and agents from any and all claims, liabilities, damages, losses, and expenses (including legal fees) arising from your use of the Service or your violation of these Terms.`,
  },
  {
    id: 'law',
    title: '8. Governing Law and Jurisdiction',
    content: `These Terms and Conditions shall be governed by and construed in accordance with the laws of Pakistan. Any legal action or proceeding arising under these Terms will be brought exclusively in the courts located in Karachi, Sindh.`,
  },
  {
    id: 'changes',
    title: '9. Changes to Terms',
    content: `We reserve the right to modify these Terms and Conditions at any time. We will notify you of any material changes by updating the "Last Updated" date at the top of this page. Your continued use of the Service after any changes constitutes your acceptance of the new terms.`,
  },
  {
    id: 'contact',
    title: '10. Contact Us',
    content: `If you have any questions or concerns about these Terms and Conditions, please do not hesitate to contact us at: asaanghar.pk@gmail.com.`,
  },
];

// --- Helper function to convert raw content to HTML ---
const toHtml = (text) => {
  if (!text) return '';
  // Replace bold markdown with strong tags
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  // Handle lists and paragraphs
  const lines = html.split('\n').filter(line => line.trim() !== '');
  let finalHtml = '';
  let inList = false;
  lines.forEach(line => {
    if (line.trim().startsWith('-')) {
      if (!inList) {
        finalHtml += '<ul>';
        inList = true;
      }
      finalHtml += `<li>${line.substring(1).trim()}</li>`;
    } else {
      if (inList) {
        finalHtml += '</ul>';
        inList = false;
      }
      finalHtml += `<p>${line.trim()}</p>`;
    }
  });
  if (inList) {
    finalHtml += '</ul>';
  }
  return finalHtml;
};

// Function to generate the HTML string for the PDF
const generatePdfHtml = () => {
  const introSection = `
    <h1>Terms and Conditions</h1>
    <p class="last-updated">Last Updated: August 5, 2025</p>
    ${toHtml(rawTermsContent.find(item => item.id === 'intro')?.content || '')}
  `;

  const sections = rawTermsContent.map(item => {
    if (item.title) {
      return `
        <h2 class="section-title">${item.title}</h2>
        ${toHtml(item.content)}
      `;
    }
    return '';
  }).join('');

  return `
    <html>
      <head>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
            font-size: 14px; 
            line-height: 1.6; 
            color: #333; 
            padding: 20px;
          }
          h1, h2 { 
            font-family: inherit;
            color: #047857;
            margin-top: 0;
            margin-bottom: 10px;
            font-weight: 700;
          }
          h1 { 
            font-size: 28px; 
            margin-bottom: 5px;
          }
          .last-updated {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 24px;
          }
          .section-title {
            font-size: 20px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 8px;
            margin-top: 32px;
          }
          p, ul { 
            margin: 0 0 16px 0;
            padding: 0;
          }
          ul {
            padding-left: 20px;
          }
          li { 
            margin-bottom: 4px;
            line-height: 1.4;
          }
          strong { 
            font-weight: 600; 
            color: #1f2937;
          }
          a { 
            color: #14b8a6; 
            text-decoration: underline; 
          }
        </style>
      </head>
      <body>
        ${introSection}
        ${sections}
      </body>
    </html>
  `;
};

const Terms = ({ show, onClose }) => {
  const scrollPosition = useRef(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (show) {
      scrollPosition.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosition.current);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [show]);

  const handleDownloadPdf = useCallback(async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const htmlContent = generatePdfHtml();
      pdf.html(htmlContent, {
        callback: (doc) => {
          doc.save('Asaan_Ghar_Terms_and_Conditions.pdf');
          setIsDownloading(false);
        },
        x: 15,
        y: 15,
        html2canvas: {
          scale: 0.8,
        },
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert('Failed to generate PDF. Please try again.');
      setIsDownloading(false);
    }
  }, [isDownloading]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <header className="flex items-center justify-between p-6 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-700 z-10 rounded-t-3xl">
              <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                Terms and Conditions
              </h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full text-sm font-semibold hover:ring-2 hover:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Download Terms as PDF"
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <FileText size={18} />
                  )}
                  <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-800 p-2 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>
            </header>

            {/* Content */}
            <motion.main
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="overflow-y-auto flex-grow px-8 py-6 scroll-smooth space-y-10 custom-scroll"
            >
              <motion.p variants={itemVariants} className="text-sm text-slate-500 dark:text-slate-400">
                Last Updated: August 5, 2025
              </motion.p>
              {rawTermsContent.map(({ id, title, content }) => (
                <motion.section key={id} variants={itemVariants} className="space-y-3">
                  {title && (
                    <motion.h3
                      whileHover={{ scale: 1.01 }}
                      className="text-xl font-semibold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 transition-all"
                    >
                      {title}
                    </motion.h3>
                  )}
                  <div 
                    className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: toHtml(content) }}
                  />
                </motion.section>
              ))}
            </motion.main>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Terms;