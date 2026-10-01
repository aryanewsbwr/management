const fs = require('fs');
let c = fs.readFileSync('src/pages/AdminPanel.jsx', 'utf8');
const replacement = \
<button onClick={() => handleToggleHideArticle(art)} className={\\\lex items-center gap-1.5 \ px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm\\\} title={art.isHidden ? 'Show News' : 'Hide News'}>
  {art.isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
  <span>{art.isHidden ? '??????' : '??????'}</span>
</button>
<button onClick={() => handleStartEdit(art)}\;
c = c.replace(/<button\s*onClick=\{\(\) => handleStartEdit\(art\)\}/, replacement);
fs.writeFileSync('src/pages/AdminPanel.jsx', c);
