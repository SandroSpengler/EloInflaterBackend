import * as nodemailer from "nodemailer";
import * as winston from "winston";

import SMTPTransport from "nodemailer/lib/smtp-transport";

export default class MailService {
	public static lastMailSend = new Date().getTime();
	private smtpTransport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

	constructor() {
		this.smtpTransport = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			auth: {
				user: "sandro.spengler1997@gmail.com",
				pass: process.env.MAIL_PASSWORD,
			},
		});
	}

	public sendMail = async () => {
		const currentTime = new Date().getTime() - 60 * 60 * 1000;

		const mail = {
			from: "sandro.spengler@gmail.com",
			to: "sandro.spengler@web.de",
			subject: "Eloinflater",
			text: "API-Key has run out!",
		};

		console.log(new Date(currentTime).toISOString());

		if (currentTime > MailService.lastMailSend) {
			MailService.lastMailSend = new Date().getTime();

			await this.smtpTransport.sendMail(mail);

			winston.log("info", `Sending API-Key renewal mail`);
		}
	};
}
