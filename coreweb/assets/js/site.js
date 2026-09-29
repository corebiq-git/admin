document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu');
  const links = document.querySelector('.nav-links');
  if(menu && links){
    menu.addEventListener('click', () => {
      const open = links.classList.toggle('mobile-open');
      links.style.display = open ? 'flex' : '';
      if(open){
        links.style.position='absolute'; links.style.left='12px'; links.style.right='12px';
        links.style.top='64px'; links.style.background='#fff'; links.style.padding='10px';
        links.style.border='1px solid #e4e8ef'; links.style.borderRadius='18px';
        links.style.flexDirection='column'; links.style.alignItems='stretch';
      }
    });
  }
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  document.querySelectorAll('form[data-demo]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.querySelector('[name=name]')?.value || '';
      const email = form.querySelector('[name=email]')?.value || '';
      const company = form.querySelector('[name=company]')?.value || '';
      const msg = form.querySelector('[name=message]')?.value || '';
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\n${msg}`);
      window.location.href = `mailto:hello@corebiq.com?subject=COREBIQ enquiry&body=${body}`;
    });
  });
});
