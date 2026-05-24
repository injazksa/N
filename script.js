// Print Function for Profession Documents
function printProfessionDocument(professionCode, professionName, requirements) {
 // Create a new window for printing
 const printWindow = window.open('', '_blank');
 
  const printContent = `
	 <!DOCTYPE html>
	 <html lang="ar" dir="rtl">
	 <head>
	 <meta charset="UTF-8">
	 <title>الأوراق المطلوبة - ${professionName}</title>
		 <style>
			 @page {
			 size: A4;
			 margin: 6mm 10mm;
			 }
		 * { 
			box-sizing: border-box; 
			-webkit-print-color-adjust: exact !important;
			print-color-adjust: exact !important;
		 }
		 a[href]:after { content: "" !important; }
		 body {
		 font-family: 'Arial', sans-serif;
		 direction: rtl;
		 text-align: right;
			 line-height: 1.15;
			 color: #1e293b;
			 margin: 0;
			 padding: 0;
			 font-size: 12px;
		 }
		 .print-container {
		 width: 100%;
		 height: 100%;
		 page-break-inside: avoid;
		 break-inside: avoid;
		 display: flex;
		 flex-direction: column;
		 }
		 .print-header {
		 text-align: center;
		 margin-bottom: 12px;
		 padding-bottom: 8px;
		 border-bottom: 2px solid #C9A26A;
		 }
		 .print-header h1 {
		 color: #1B2A41;
		 font-size: 20px;
		 margin: 0 0 2px 0;
		 font-weight: bold;
		 }
		 .print-header .subtitle {
		 color: #C9A26A;
		 font-size: 13px;
		 font-weight: bold;
		 margin-bottom: 4px;
		 }
		 .office-info {
		 color: #475569;
		 font-size: 10px;
		 line-height: 1.3;
		 }
		 .document-title {
		 background: #1B2A41;
		 color: white;
		 padding: 8px 10px;
		 margin: 8px 0;
		 border-radius: 4px;
		 font-size: 14px;
		 font-weight: bold;
		 text-align: center;
		 box-shadow: 0 1px 2px rgba(0,0,0,0.1);
		 }
		 .profession-info {
		 background: #f8fafc;
		 padding: 6px 10px;
		 margin: 6px 0;
		 border-right: 3px solid #C9A26A;
		 border-radius: 3px;
		 font-size: 11px;
		 display: flex;
		 justify-content: space-between;
		 align-items: center;
		 flex-wrap: wrap;
		 }
		 .requirements-list {
		 margin: 8px 0;
		 padding-right: 20px;
		 flex-grow: 1;
		 }
		 .requirements-list li {
		 padding: 4px 0;
		 border-bottom: 0.5px solid #e8eef7;
		 margin-bottom: 2px;
		 }
		 .requirements-list li:last-child { border-bottom: none; }
		 .footer {
		 margin-top: auto;
		 padding-top: 8px;
		 border-top: 1px solid #e2e8f0;
		 text-align: center;
		 color: #64748b;
		 font-size: 9px;
		 }
		 .footer p { margin: 2px 0; }
		 h2 { 
		 color: #1B2A41; 
		 margin: 6px 0 4px; 
		 font-size: 13px;
		 border-bottom: 0.5px solid #e2e8f0;
		 padding-bottom: 2px;
		 }
	 </style>
	 </head>
	 <body>
	 <div class="print-container">
	 <div class="print-header">
	 <h1>مكتب تأشيرات السعودية في الأردن</h1>
	 <div class="subtitle">المركز المعتمد من السفارة السعودية</div>
	 <div class="office-info">
	 <div>📍 العنوان: الدوار الأول - جبل عمان، الأردن</div>
	 <div>📞 الهاتف / واتساب: 0789881009 | ✉️ البريد: Visa@saudia-visa.com</div>
	 <div>🌐 الموقع الإلكتروني: www.saudia-visa.com</div>
	 </div>
	 </div>
	 
	 <div class="document-title">
	 الأوراق المطلوبة لتأشيرة العمل السعودية
	 </div>
	 
		 <div class="profession-info">
		 <span><strong>المهنة:</strong> ${professionName}</span>
		 <span><strong>رمز المهنة:</strong> ${professionCode}</span>
		 <span><strong>التاريخ:</strong> ${new Date().toLocaleDateString('ar-SA')}</span>
		 </div>
	 
	 <h2>الأوراق والمستندات المطلوبة:</h2>
			 <ol class="requirements-list">
			 ${requirements.filter(r => {
				// Deduplicate passport/photo in print view too
				// Only deduplicate if it's EXACTLY the same string and not the first occurrence
if (r === 'إحضار جواز السفر و 6 صور شخصية بخلفية بيضاء حديثة لكافة المعاملات.' && requirements.indexOf(r) !== requirements.lastIndexOf(r) && requirements.indexOf(r) !== requirements.indexOf(r)) return false;
				return true;
			 }).map(req => `<li>${req}</li>`).join('')}
			 </ol>

		 ${(!requirements.some(r => r.includes('الاعتماد المهني')) && !professionName.includes('استقدام') && !professionName.includes('اقامة')) ? `
		 <div style="margin-top: 6px; padding: 6px; background-color: #f0f7ff; border-right: 2px solid #3b82f6; border-radius: 3px;">
			 <div style="font-weight: bold; color: #1e40af; font-size: 9pt; margin-bottom: 2px;">تنبيه بخصوص الاعتماد المهني</div>
			 <div style="color: #1e3a8a; font-size: 8pt; line-height: 1.2;">هذه المهنة لا تتطلب اختبار اعتماد مهني حالياً، ولكن يرجى العلم أنه قد يتم تفعيل شرط الاعتماد في أي وقت حسب تحديثات الأنظمة السعودية.</div>
		 </div>
		 ` : ''}
		 
		 <div class="footer">
		 <p><strong>ملاحظة:</strong> قد تختلف المستندات حسب السفارة والحالة الفردية، يرجى التواصل معنا للحصول على معلومات دقيقة ومحدثة.</p>
		 <p>© 2026 مكتب تأشيرات السعودية في الأردن - جميع الحقوق محفوظة</p>
		 </div>
	 </div>
	 </body>
	 </html>
	 `;
 
 printWindow.document.write(printContent);
 printWindow.document.close();
 
 // Wait for content to load then print
 printWindow.onload = function() {
 printWindow.print();
 };
}
