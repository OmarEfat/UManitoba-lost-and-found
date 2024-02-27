from email.message import EmailMessage
import ssl ## Extra layer of security 
import smtplib

EMAIL_SENDER = "umanitobafoundandlost@gmail.com"
EMAIL_PASSWORD = 'yqsn qcnm taxj apzu' ## We need to find a way to hide this password 

def send_html_email(email_receiver, subject, body):
    email = EmailMessage()
    email['From'] = EMAIL_SENDER
    email['To'] = email_receiver
    email['Subject'] = subject
    email.add_alternative(body, subtype='html')

    context = ssl.create_default_context()

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
            smtp.login(EMAIL_SENDER, EMAIL_PASSWORD)
            smtp.send_message(email)
        print("Email sent successfully!")
    except smtplib.SMTPException as e:
        print(f"SMTP error occurred: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

## Example 
email_receiver = "omar.effat18@gmail.com"
subject = "Your Item is found!!!"

body = """
<html>
        <h1>There is an item matching your lost item</h1>
</html>
"""
send_html_email(email_receiver , subject , body)
######


