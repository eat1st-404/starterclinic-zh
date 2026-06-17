(function () {
  const FEISHU_WEBHOOK = 'https://open.feishu.cn/open-apis/bot/v2/hook/6d8d3b64-d345-4f6f-b68d-111e78658900';

  function buildPopover() {
    const popover = document.createElement('div');
    popover.className = 'question-popover';
    popover.setAttribute('role', 'dialog');
    popover.setAttribute('aria-modal', 'false');
    popover.setAttribute('aria-labelledby', 'questionTitle');
    popover.innerHTML = `
      <button class="question-close" type="button" aria-label="关闭">×</button>
      <h2 id="questionTitle">提一个酵种问题</h2>
      <form class="question-form">
        <textarea id="questionText" placeholder="写下你的问题，比如：第5天，1:2:2喂养，25度，8小时只涨了30%，正常吗？" required></textarea>
        <button class="btn-primary question-send" type="submit">发送</button>
      </form>
      <div class="question-status" aria-live="polite"></div>
    `;
    document.body.appendChild(popover);
    return popover;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const triggers = document.querySelectorAll('[data-question-open]');
    if (!triggers.length) return;

    const popover = buildPopover();
    const form = popover.querySelector('.question-form');
    const textarea = popover.querySelector('#questionText');
    const closeBtn = popover.querySelector('.question-close');
    const sendBtn = popover.querySelector('.question-send');
    const status = popover.querySelector('.question-status');

    function openPopover() {
      popover.classList.add('open');
      status.classList.remove('show');
      setTimeout(function () { textarea.focus(); }, 0);
    }

    function closePopover() {
      popover.classList.remove('open');
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', openPopover);
    });

    closeBtn.addEventListener('click', closePopover);

    function setStatus(message, type) {
      status.textContent = message;
      status.classList.toggle('error', type === 'error');
      status.classList.add('show');
    }

    async function sendToFeishu(question) {
      const contact = localStorage.getItem('sc_user_contact') || '未登录';
      const starterName = localStorage.getItem('sc_starter_name') || '酵种';
      const text = [
        '新的酵种问题',
        `用户：${contact}`,
        `酵种名：${starterName}`,
        `页面：${location.href}`,
        '',
        question,
      ].join('\n');

      return fetch(FEISHU_WEBHOOK, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          msg_type: 'text',
          content: { text },
        }),
      });
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const question = textarea.value.trim();
      if (!question) return;

      sendBtn.disabled = true;
      sendBtn.textContent = '发送中…';
      status.classList.remove('show', 'error');

      sendToFeishu(question)
        .then(function () {
          textarea.value = '';
          setStatus('已发送，我会在飞书里看到。');
        })
        .catch(function () {
          setStatus('发送失败，请稍后再试。', 'error');
        })
        .finally(function () {
          sendBtn.disabled = false;
          sendBtn.textContent = '发送';
        });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closePopover();
    });
  });
})();
