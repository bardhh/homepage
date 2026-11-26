export default function Contact() {
  return (
    <section tabIndex={-1} id="contact" aria-labelledby="contact-title">
      <h2 id="contact-title" className="profile-title mb-4">Contact</h2>
      <a href="mailto:bardhh@gmail.com" className="inline-block text-xl font-medium text-[var(--link)] underline decoration-current/40 underline-offset-4 hover:decoration-current">
        bardhh@gmail.com
      </a>
    </section>
  );
}
