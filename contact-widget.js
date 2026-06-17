(function () {
  const XHS_URL = 'https://xhslink.com/m/4iZQBpfQrlp';

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    const helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('readonly', '');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    document.body.removeChild(helper);
    return Promise.resolve();
  }

  function buildPopover() {
    const popover = document.createElement('div');
    popover.className = 'question-popover';
    popover.setAttribute('role', 'dialog');
    popover.setAttribute('aria-modal', 'false');
    popover.setAttribute('aria-labelledby', 'questionTitle');
    popover.innerHTML = `
      <button class="question-close" type="button" aria-label="关闭">×</button>
      <h2 id="questionTitle">提一个酵种问题</h2>
      <p>把你的酵种天数、室温、喂养比例、涨幅和气味写下来，复制后发到小红书给我。</p>
      <textarea id="questionText" placeholder="例如：第5天，1:2:2喂养，25度，8小时只涨了30%，闻起来有点酸，是正常的吗？"></textarea>
      <div class="question-actions">
        <button class="btn-primary" type="button" data-copy-question>复制问题</button>
        <a class="btn-outline" href="${XHS_URL}" target="_blank" rel="noopener">去小红书</a>
      </div>
      <div class="question-status" aria-live="polite">已复制，可以去小红书发给我。</div>
    `;
    document.body.appendChild(popover);
    return popover;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const triggers = document.querySelectorAll('[data-question-open]');
    if (!triggers.length) return;

    const popover = buildPopover();
    const textarea = popover.querySelector('#questionText');
    const closeBtn = popover.querySelector('.question-close');
    const copyBtn = popover.querySelector('[data-copy-question]');
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

    copyBtn.addEventListener('click', function () {
      const text = textarea.value.trim() || textarea.placeholder;
      copyText(text).then(function () {
        status.classList.add('show');
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closePopover();
    });
  });
})();
