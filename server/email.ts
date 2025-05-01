// In a real app, we would use SendGrid or another email service
// For now, we'll just log the email content that would be sent

interface EmailTemplate {
  subject: string;
  textContent: string;
  htmlContent: string;
}

/**
 * Email templates for store verification notifications
 */

export const getStoreApprovalTemplate = (storeName: string): EmailTemplate => {
  const subject = `Your store ${storeName} has been approved!`;
  
  const textContent = `
Congratulations!

Your store "${storeName}" has been approved by our administrators. You can now start listing your products on LocalThreads Marketplace.

Here's what you can do now:
1. Log in to your seller dashboard
2. Add your products with high-quality images and detailed descriptions
3. Start selling to customers across South Africa

If you have any questions, please contact our seller support team.

Thank you for joining LocalThreads Marketplace!
`;

  const htmlContent = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #4CAF50;">Congratulations!</h2>
  
  <p>Your store "<strong>${storeName}</strong>" has been approved by our administrators. You can now start listing your products on LocalThreads Marketplace.</p>
  
  <h3>Here's what you can do now:</h3>
  <ol>
    <li>Log in to your seller dashboard</li>
    <li>Add your products with high-quality images and detailed descriptions</li>
    <li>Start selling to customers across South Africa</li>
  </ol>
  
  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p style="margin: 0;">If you have any questions, please contact our seller support team.</p>
  </div>
  
  <p>Thank you for joining LocalThreads Marketplace!</p>
</div>
`;

  return { subject, textContent, htmlContent };
};

export const getStoreRejectionTemplate = (storeName: string, reason: string = 'did not meet our criteria'): EmailTemplate => {
  const subject = `Update on your store application for ${storeName}`;
  
  const textContent = `
Dear Seller,

We have reviewed your application for "${storeName}" on LocalThreads Marketplace.

Unfortunately, we cannot approve your store at this time because it ${reason}.

You can address these issues and reapply by:
1. Logging in to your seller dashboard
2. Updating your store information
3. Requesting verification again

For more information or assistance, please contact our seller support team.

Thank you for your interest in LocalThreads Marketplace.
`;

  const htmlContent = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #F44336;">Store Application Update</h2>
  
  <p>We have reviewed your application for "<strong>${storeName}</strong>" on LocalThreads Marketplace.</p>
  
  <p>Unfortunately, we cannot approve your store at this time because it ${reason}.</p>
  
  <h3>You can address these issues and reapply by:</h3>
  <ol>
    <li>Logging in to your seller dashboard</li>
    <li>Updating your store information</li>
    <li>Requesting verification again</li>
  </ol>
  
  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p style="margin: 0;">For more information or assistance, please contact our seller support team.</p>
  </div>
  
  <p>Thank you for your interest in LocalThreads Marketplace.</p>
</div>
`;

  return { subject, textContent, htmlContent };
};

/**
 * Function to send emails (in a real app, this would use SendGrid or similar)
 */
export const sendEmail = async (to: string, template: EmailTemplate): Promise<boolean> => {
  try {
    // In a real implementation, we would use SendGrid or another email service
    console.log(`\n==== EMAIL WOULD BE SENT TO: ${to} ====`);
    console.log(`SUBJECT: ${template.subject}`);
    console.log(`\nTEXT CONTENT:\n${template.textContent}`);
    console.log(`\nHTML CONTENT (not shown completely):\n${template.htmlContent.substring(0, 100)}...\n`);
    console.log(`==== END OF EMAIL ====\n`);
    
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

/**
 * Main function to send store verification notification
 */
export const sendStoreVerificationEmail = async (
  email: string, 
  storeName: string, 
  isApproved: boolean,
  rejectionReason?: string
): Promise<boolean> => {
  const template = isApproved 
    ? getStoreApprovalTemplate(storeName)
    : getStoreRejectionTemplate(storeName, rejectionReason);
  
  return await sendEmail(email, template);
};