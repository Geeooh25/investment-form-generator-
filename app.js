
    // All input references
    const companyEl = document.getElementById('companyName');
    const founderEl = document.getElementById('founderName');
    const investorEl = document.getElementById('investorName');
    const valuationEl = document.getElementById('valuation');
    const equityEl = document.getElementById('equityPercent');
    const liquidationEl = document.getElementById('liquidationPref');
    const boardEl = document.getElementById('boardSeats');
    const vestingEl = document.getElementById('vestingSchedule');
    const antiEl = document.getElementById('antiDilution');
    const proRataEl = document.getElementById('proRata');
    const dragTagEl = document.getElementById('dragTag');
    const extraNotesEl = document.getElementById('extraNotes');
    const signCompanyEl = document.getElementById('signCompany');
    const signInvestorEl = document.getElementById('signInvestor');
    const termDateEl = document.getElementById('termDate');

    const previewContainer = document.getElementById('termSheetPreviewRoot');
    const refreshBtn = document.getElementById('refreshPreviewBtn');
    const downloadBtn = document.getElementById('downloadPdfAction');
    const copyBtn = document.getElementById('copyShareAction');
    const toastDiv = document.getElementById('globalToast');

    function formatCurrency(value) {
        let num = parseFloat(value);
        if (isNaN(num)) return '$0';
        return '$' + num.toLocaleString('en-US');
    }

    // compute investment amount based on valuation and equity %
    function computeInvestmentAmount(preMoney, equityPercent) {
        let pre = parseFloat(preMoney);
        let eq = parseFloat(equityPercent);
        if (isNaN(pre) || isNaN(eq) || eq <= 0 || eq >= 100) return 0;
        let investment = (pre * eq) / (100 - eq);
        return investment;
    }

    // escape html to prevent injection
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    // generate full term sheet html
    function renderTermSheetHTML() {
        const company = (companyEl.value.trim()) || '[Company Name]';
        const founder = (founderEl.value.trim()) || '[Founder]';
        const investor = (investorEl.value.trim()) || '[Investor]';
        let preMoney = parseFloat(valuationEl.value);
        if (isNaN(preMoney)) preMoney = 8000000;
        let equityPercentVal = parseFloat(equityEl.value);
        if (isNaN(equityPercentVal)) equityPercentVal = 15;
        const investmentVal = computeInvestmentAmount(preMoney, equityPercentVal);
        const investmentDisplay = investmentVal > 0 ? formatCurrency(investmentVal) : '—';
        const valuationDisplay = formatCurrency(preMoney);
        const equityDisplay = equityPercentVal.toFixed(2) + '%';
        const liquidationText = liquidationEl.value;
        const boardSeatsText = boardEl.value;
        const vestingText = vestingEl.value;
        const antiText = antiEl.value;
        const proRataText = proRataEl.value;
        const dragTagText = dragTagEl.value;
        const extraText = extraNotesEl.value.trim();
        const signCompanyText = signCompanyEl.value.trim() || 'Authorized Representative';
        const signInvestorText = signInvestorEl.value.trim() || 'Investor Partner';
        let termDateRaw = termDateEl.value;
        if (!termDateRaw) termDateRaw = new Date().toISOString().slice(0,10);
        
        let postMoney = preMoney + investmentVal;
        let postMoneyDisplay = formatCurrency(postMoney);
        
        return `
            <div class="ts-title">
                <h3>📄 INVESTMENT TERM SHEET</h3>
                <p>Summary of key terms (non-binding except confidentiality)</p>
                <small><i class="far fa-calendar-alt"></i> Date: ${escapeHtml(termDateRaw)}</small>
            </div>
            <div>
                <div class="section-title"><i class="fas fa-bullhorn"></i> Parties & Valuation</div>
                <div class="row-item"><div class="row-label">Company:</div><div class="row-value">${escapeHtml(company)}</div></div>
                <div class="row-item"><div class="row-label">Founder / Management:</div><div class="row-value">${escapeHtml(founder)}</div></div>
                <div class="row-item"><div class="row-label">Investor:</div><div class="row-value">${escapeHtml(investor)}</div></div>
                <div class="row-item"><div class="row-label">Pre-Money Valuation:</div><div class="row-value">${valuationDisplay}</div></div>
                <div class="row-item"><div class="row-label">Investment Amount:</div><div class="row-value">${investmentDisplay}</div></div>
                <div class="row-item"><div class="row-label">Post-Money Valuation:</div><div class="row-value">${postMoneyDisplay}</div></div>
                <div class="row-item"><div class="row-label">Equity Stake (Investor):</div><div class="row-value">${equityDisplay}</div></div>
            </div>
            <div>
                <div class="section-title"><i class="fas fa-gavel"></i> Investor Rights & Protections</div>
                <div class="row-item"><div class="row-label">Liquidation Preference:</div><div class="row-value">${escapeHtml(liquidationText)}</div></div>
                <div class="row-item"><div class="row-label">Board Representation:</div><div class="row-value">${boardSeatsText} seat(s) for Investor</div></div>
                <div class="row-item"><div class="row-label">Founder Vesting Schedule:</div><div class="row-value">${escapeHtml(vestingText)}</div></div>
                <div class="row-item"><div class="row-label">Anti‑Dilution Clause:</div><div class="row-value">${escapeHtml(antiText)}</div></div>
                <div class="row-item"><div class="row-label">Pro‑Rata Rights:</div><div class="row-value">${escapeHtml(proRataText)}</div></div>
                <div class="row-item"><div class="row-label">Drag‑Along / Tag‑Along:</div><div class="row-value">${escapeHtml(dragTagText)}</div></div>
            </div>
            ${extraText ? `
            <div>
                <div class="section-title"><i class="fas fa-pen-fancy"></i> Additional Clauses</div>
                <div class="row-item"><div class="row-label">Special Terms:</div><div class="row-value">${escapeHtml(extraText).replace(/\n/g, '<br>')}</div></div>
            </div>` : ''}
            <div class="signature-row">
                <div class="sign-box">
                    <strong>${escapeHtml(company)}</strong><br>
                    Signature: <span style="font-family: monospace;">__________________</span><br>
                    Name: ${escapeHtml(signCompanyText)}<br>
                    Date: ${escapeHtml(termDateRaw)}
                </div>
                <div class="sign-box">
                    <strong>${escapeHtml(investor)}</strong><br>
                    Signature: <span style="font-family: monospace;">__________________</span><br>
                    Name: ${escapeHtml(signInvestorText)}<br>
                    Date: ${escapeHtml(termDateRaw)}
                </div>
            </div>
            <div class="footer-note">
                <i class="fas fa-scale-balanced"></i> This Term Sheet is a summary of proposed terms and does not constitute a legally binding agreement (except for confidentiality and exclusivity provisions).<br>
                Generated by TermSheet Forge — investment ready.
            </div>
        `;
    }
    
    function updatePreview() {
        const newHtml = renderTermSheetHTML();
        previewContainer.innerHTML = newHtml;
    }
    
    // bind inputs to update preview
    function bindAllInputs() {
        const inputs = [companyEl, founderEl, investorEl, valuationEl, equityEl, liquidationEl, boardEl, vestingEl, antiEl, proRataEl, dragTagEl, extraNotesEl, signCompanyEl, signInvestorEl, termDateEl];
        inputs.forEach(input => {
            if (input) {
                input.addEventListener('input', () => updatePreview());
                input.addEventListener('change', () => updatePreview());
            }
        });
    }
    
    // export to PDF with improved stability
    async function exportToPDF() {
        const element = previewContainer;
        if (!element) return;
        const previewScrollDiv = document.getElementById('previewScroll');
        const originalOverflow = previewScrollDiv.style.overflow;
        previewScrollDiv.style.overflow = 'visible';
        const opt = {
            margin: [0.4, 0.4, 0.4, 0.4],
            filename: `TermSheet_${companyEl.value.trim().replace(/\s/g, '_') || 'Startup'}_${new Date().toISOString().slice(0,10)}.pdf`,
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: { scale: 2, useCORS: false, letterRendering: true, logging: false },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        try {
            await html2pdf().set(opt).from(element).save();
            showToastMessage("PDF generated successfully!");
        } catch (err) {
            console.error(err);
            alert("PDF error, please try again.");
        } finally {
            previewScrollDiv.style.overflow = originalOverflow;
        }
    }
    
    // copy/share with rich HTML + plain text
    async function copyTermSheetRich() {
        const sheetElement = previewContainer;
        if (!sheetElement) return;
        const cloneSheet = sheetElement.cloneNode(true);
        cloneSheet.style.width = '100%';
        cloneSheet.style.background = 'white';
        cloneSheet.style.padding = '24px';
        cloneSheet.style.borderRadius = '20px';
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'fixed';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '0';
        tempDiv.appendChild(cloneSheet);
        document.body.appendChild(tempDiv);
        const htmlContent = cloneSheet.outerHTML;
        const plainText = `INVESTMENT TERM SHEET\nCompany: ${companyEl.value}\nInvestor: ${investorEl.value}\nValuation: ${valuationEl.value}\nEquity: ${equityEl.value}%\nLiquidation: ${liquidationEl.value}\nBoard Seats: ${boardEl.value}\nVesting: ${vestingEl.value}\nAnti-dilution: ${antiEl.value}\nPro-rata: ${proRataEl.value}\nDrag/Tag: ${dragTagEl.value}\nDate: ${termDateEl.value}\nSignatories: ${signCompanyEl.value} / ${signInvestorEl.value}`;
        try {
            if (navigator.clipboard && window.ClipboardItem) {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'text/html': new Blob([htmlContent], { type: 'text/html' }),
                        'text/plain': new Blob([plainText], { type: 'text/plain' })
                    })
                ]);
                showToastMessage("✅ Term sheet copied! Rich text + plain ready to share.");
            } else {
                await navigator.clipboard.writeText(plainText);
                showToastMessage("📋 Copied as plain text");
            }
        } catch (err) {
            showToastMessage("Manual selection required");
        } finally {
            document.body.removeChild(tempDiv);
        }
    }
    
    function showToastMessage(msg) {
        toastDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
        toastDiv.style.opacity = '1';
        setTimeout(() => {
            toastDiv.style.opacity = '0';
        }, 2500);
    }
    
    function init() {
        bindAllInputs();
        updatePreview();
        refreshBtn.addEventListener('click', () => {
            updatePreview();
            showToastMessage("Preview refreshed");
        });
        downloadBtn.addEventListener('click', exportToPDF);
        copyBtn.addEventListener('click', copyTermSheetRich);
    }
    
    init();
