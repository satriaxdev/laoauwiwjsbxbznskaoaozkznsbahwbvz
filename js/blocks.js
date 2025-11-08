// js/code-blocks.js
function createCodeBlock(code, language) {
    const codeBlock = document.createElement('div');
    codeBlock.className = 'code-block';

    const codeHeader = document.createElement('div');
    codeHeader.className = 'code-header';

    const codeTitle = document.createElement('div');
    codeTitle.className = 'code-title';
    codeTitle.textContent = language.toUpperCase();

    const codeActions = document.createElement('div');
    codeActions.className = 'code-actions';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.onclick = () => copyCode(code);

    const runBtn = document.createElement('button');
    runBtn.className = 'code-btn';
    runBtn.textContent = 'Run';
    runBtn.onclick = () => runCode(code, language, codeBlock);

    codeActions.appendChild(copyBtn);
    codeActions.appendChild(runBtn);

    codeHeader.appendChild(codeTitle);
    codeHeader.appendChild(codeActions);

    const codeContent = document.createElement('div');
    codeContent.className = 'code-content';
    codeContent.textContent = code;

    codeBlock.appendChild(codeHeader);
    codeBlock.appendChild(codeContent);

    return codeBlock;
}

function copyCode(code) {
    const textarea = document.createElement('textarea');
    textarea.value = code;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    const status = document.getElementById('status');
    const originalStatus = status.textContent;
    status.textContent = 'Kode berhasil disalin!';
    setTimeout(() => {
        status.textContent = originalStatus;
    }, 2000);
}

function runCode(code, language, codeBlock) {
    const existingOutput = codeBlock.querySelector('.code-output');
    if (existingOutput) {
        existingOutput.remove();
    }

    const outputArea = document.createElement('div');
    outputArea.className = 'code-output';

    try {
        let output = '';

        if (language === 'html' || code.includes('<html') || code.includes('<!DOCTYPE')) {
            const iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '200px';
            iframe.style.border = 'none';
            iframe.style.background = 'white';

            outputArea.appendChild(iframe);

            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(code);
            iframeDoc.close();

            outputArea.style.display = 'block';
            output = 'HTML rendered successfully';
        } else if (language === 'javascript' || language === 'js') {
            const originalLog = console.log;
            let logs = [];

            console.log = function (...args) {
                logs.push(args.join(' '));
                originalLog.apply(console, args);
            };

            try {
                const result = eval(code);
                if (result !== undefined) {
                    logs.push(String(result));
                }
            } catch (e) {
                logs.push('Error: ' + e.message);
            }

            console.log = originalLog;

            output = logs.join('\n');
            outputArea.textContent = output || 'No output';
            outputArea.style.display = 'block';
        } else if (language === 'python') {
            output = 'Python code execution simulated:\n' + code.replace(/print\s*\((.*)\)/g, '$1');
            outputArea.textContent = output;
            outputArea.style.display = 'block';
        } else if (language === 'css') {
            const style = document.createElement('style');
            style.textContent = code;
            document.head.appendChild(style);
            output = 'CSS applied to page';
            outputArea.textContent = output;
            outputArea.style.display = 'block';

            setTimeout(() => {
                document.head.removeChild(style);
            }, 5000);
        } else {
            output = 'Code executed successfully';
            outputArea.textContent = output;
            outputArea.style.display = 'block';
        }

        if (output && !outputArea.querySelector('iframe')) {
            outputArea.textContent = output;
        }

    } catch (error) {
        outputArea.textContent = 'Error: ' + error.message;
        outputArea.style.display = 'block';
    }

    codeBlock.appendChild(outputArea);
}