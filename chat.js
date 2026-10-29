(() => {
  const API_URL = window.TANVIR_AI_API_URL || 'http://localhost:8000/api/chat';
  const launcher = document.getElementById('chat-launcher');
  const panel = document.getElementById('chat-panel');
  const close = document.getElementById('chat-close');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');
  const submit = form.querySelector('button');
  const history = [];

  function setOpen(open) {
    panel.classList.toggle('is-open', open);
    panel.setAttribute('aria-hidden', String(!open));
    launcher.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
  }
  function addMessage(text, kind, sourceNames = []) {
    const item = document.createElement('article');
    item.className = `chat-message ${kind}`;
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    item.appendChild(paragraph);
    if (sourceNames.length) {
      const source = document.createElement('small');
      source.className = 'chat-source';
      source.textContent = `From: ${sourceNames.join(' · ')}`;
      item.appendChild(source);
    }
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
    return item;
  }

  launcher.addEventListener('click', () => setOpen(!panel.classList.contains('is-open')));
  close.addEventListener('click', () => { setOpen(false); launcher.focus(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && panel.classList.contains('is-open')) { setOpen(false); launcher.focus(); }
  });
  input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = `${Math.min(input.scrollHeight, 110)}px`; });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question || submit.disabled) return;
    addMessage(question, 'user');
    history.push({ role: 'user', content: question });
    input.value = '';
    input.style.height = 'auto';
    submit.disabled = true;
    const pending = addMessage('Thinking…', 'assistant pending');
    try {
      const response = await fetch(API_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history: history.slice(-8, -1) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'The assistant could not answer right now.');
      pending.remove();
      addMessage(data.answer, 'assistant', data.sources || []);
      history.push({ role: 'assistant', content: data.answer });
    } catch (error) {
      pending.remove();
      addMessage(error.message.includes('fetch') ? 'The assistant server is unavailable. Start the local backend or check its API URL.' : error.message, 'assistant error');
      history.pop();
    } finally {
      submit.disabled = false;
      input.focus();
    }
  });
})();
