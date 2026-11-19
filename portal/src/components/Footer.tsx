import Link from 'next/link';
import { Compass, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-base">
                Somalia Humanitarian Intelligence Portal
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Open-source humanitarian data intelligence cross-analyzing UN OCHA FTS financial flows, 
              HDX 3W physical footprints, IOM DTM Emergency Trends Tracking (ETT), and the Somalia 
              Humanitarian Fund across all 90 districts.
            </p>
            <div className="text-xs text-slate-500">
              Built for Somali Civil Society, International Responders, Donors &amp; Policy Researchers.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Intelligence Tools
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/districts" className="hover:text-emerald-400 transition-colors">
                  90 District Profiles
                </Link>
              </li>
              <li>
                <Link href="/ngos" className="hover:text-emerald-400 transition-colors">
                  204 NGO Directory
                </Link>
              </li>
              <li>
                <Link href="/dossier-builder" className="hover:text-emerald-400 transition-colors">
                  Proposal Dossier Builder
                </Link>
              </li>
              <li>
                <Link href="/pipeline" className="hover:text-emerald-400 transition-colors">
                  Automated Pipeline Telemetry
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Sources */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Official Data Feeds
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://fts.unocha.org/countries/206"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                >
                  UN OCHA FTS Somalia <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://data.humdata.org/group/som"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                >
                  HDX Somalia Datasets <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://cbpf.data.unocha.org"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                >
                  Somalia Humanitarian Fund <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://dtm.iom.int/somalia"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                >
                  IOM DTM Displacement <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div>
            &copy; 2026 Open Humanitarian Intelligence Initiative. Open Source under MIT License.
          </div>
          <div className="mt-2 sm:mt-0 flex items-center gap-1">
            Engineered with Next.js &bull; Powered by Open Humanitarian Data
          </div>
        </div>
      </div>
    </footer>
  );
}
