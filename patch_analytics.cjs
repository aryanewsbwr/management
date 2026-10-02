const fs = require('fs');

let c = fs.readFileSync('src/pages/AdminPanel.jsx', 'utf8');

const btn = `          <button
            onClick={() => setActiveTab('analytics')}
            className={\`flex items-center gap-2 px-4 py-2.5 rounded-xl transition \${
              activeTab === 'analytics'
                ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }\`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>📊 एनालिटिक्स (Analytics)</span>
          </button>`;

c = c.replace(/(<button[^>]+onClick={\(\) => setActiveTab\('breaking'\)}[^>]+>[\s\S]*?<\/button>)/, "$1\n\n" + btn);

const content = `
        {/* ==================================================== */}
        {/* 4. ANALYTICS PAGE */}
        {/* ==================================================== */}
        {activeTab === 'analytics' && (() => {
          const totalArticles = beawarArticles.length;
          const totalViews = beawarArticles.reduce((sum, a) => sum + (a.views || 0), 0);
          const topArticles = [...beawarArticles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

          return (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-800 space-y-6">
              <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                <h3 className="text-xl font-bold font-hindi text-gray-900 dark:text-white">
                  📊 वेबसाइट एनालिटिक्स (Website Analytics)
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  यहाँ आप देख सकते हैं कि आपकी वेबसाइट पर कितनी खबरें अपलोड हुई हैं और उन्हें कितने लोगों ने पढ़ा है।
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/50 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-amber-600 dark:text-amber-500 mb-1">{totalArticles}</span>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">कुल खबरें (Total Articles)</span>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-emerald-600 dark:text-emerald-500 mb-1">{totalViews}</span>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">कुल व्यूज (Total Views)</span>
                </div>
              </div>

              {/* Top Articles List */}
              <div className="pt-4">
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 border-l-4 border-red-500 pl-2">
                  🔥 टॉप 5 सबसे ज्यादा पढ़ी गई खबरें (Top 5 Most Read)
                </h4>
                <div className="space-y-3">
                  {topArticles.map((art, idx) => (
                    <div key={art.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                          {art.titleHi}
                        </span>
                      </div>
                      <div className="flex-shrink-0 ml-4 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded font-bold text-xs whitespace-nowrap">
                        👁️ {art.views || 0}
                      </div>
                    </div>
                  ))}
                  {topArticles.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">अभी कोई डेटा नहीं है।</p>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
`;

c = c.replace(/({\/\* 3\. BREAKING TICKER MANAGER \*\/\}[\s\S]*?{activeTab === 'breaking' && \([\s\S]*?<\/div>\s*\)\s*})/, "$1\n" + content);

if (!c.includes("BarChart2")) {
  c = c.replace("import {", "import { BarChart2,");
}

fs.writeFileSync('src/pages/AdminPanel.jsx', c, 'utf8');
console.log('done');
