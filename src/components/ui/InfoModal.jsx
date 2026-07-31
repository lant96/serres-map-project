import { useState, useRef, useEffect } from "react";
import "../../app/styles/infoModal.css";

const TEAM = [
  { name: "Κυριάκος Ρόντσης", photo: "https://map.f8studio.gr/Photos/app-nocodb/team/team-Kyriakos.jpg" },
  { name: "Αθανασία Λαντούρη", photo: "https://map.f8studio.gr/Photos/app-nocodb/team/team-Athanasia-1.jpg" },
  { name: "Ελένη Μαργούδη", photo: "https://map.f8studio.gr/Photos/app-nocodb/team/team-Eleni.jpg" },
  { name: "Γιώργος Μερτζανίδης", photo: "https://map.f8studio.gr/Photos/app-nocodb/team/team-GiorgosM.jpg" },
  { name: "Ηρακλής Τζαρίδης", photo: "https://map.f8studio.gr/Photos/app-nocodb/team/team-Iraklis_2.jpg" },
  { name: "Αλέξης Χατζόγλου", photo: "https://map.f8studio.gr/Photos/app-nocodb/team/team-Alex.jpg" },
  { name: "Γιώργος Βάκαλος", photo: "https://map.f8studio.gr/Photos/app-nocodb/team/team-GiorgosV.jpg" },
  { name: "Yutseng Wu", photo: "https://map.f8studio.gr/Photos/app-nocodb/team/team-YutsengWu_2.jpg" },
];


export default function InfoModal() {
  const [open, setOpen] = useState(true);
  const [showFade, setShowFade] = useState(true);

  const containerRef = useRef(null);
  const aboutRef = useRef(null);

  const scrollToAbout = () => {
    const container = containerRef.current;
    const target = aboutRef.current;

    if (!container || !target) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const start = container.scrollTop;
    const end = start + (targetRect.top - containerRect.top);

    const duration = 700;
    let startTime = null;

    const easeInOutCubic = (t) =>
      t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animate = (time) => {
      if (!startTime) startTime = time;

      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      container.scrollTop = start + (end - start) * ease;

      if (elapsed < duration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const isBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - 5;

      setShowFade(!isBottom);
    };

    el.addEventListener("scroll", onScroll);

    // run once on mount
    onScroll();

    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {open && (
        <div className="info-backdrop" onClick={() => setOpen(false)}>
          <div
            className="info-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="info-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>

            <div className="info-scroll" ref={containerRef}>

              <div className="info-section info-welcome">
                <div className="info-logo">
                  <span className="info-logo-text">
                    Serres Map Project
                  </span>
                </div>

                <p className="info-body">
                  Καλώς ήρθατε στο Serres Map Project — μια ερευνητική ψηφιακή 
                  πλατφόρμα που εξερευνά την ιστορική μνήμη της πόλης των Σερρών 
                  μέσα από χαρτογραφικές, φωτογραφικές και αρχειακές πηγές.

                  Η εφαρμογή λειτουργεί ως διαδραστικό σημείο πρόσβασης στο ερευνητικό 
                  υλικό και στην ψηφιακή ανασύσταση τμημάτων της πόλης πριν από την 
                  εφαρμογή του πολεοδομικού σχεδίου του 1925.
                </p>

                <button
                  className="info-continue"
                  onClick={scrollToAbout}
                >
                  ↓
                </button>
              </div>

              <div className="info-divider" />

              <div ref={aboutRef} className="info-section">
                <div className="info-logo">
                  {/* <span className="info-logo-text">About</span> */}
                </div>

                <p className="info-body">
                  Το project επικεντρώνεται στη μελέτη και ψηφιακή τεκμηρίωση της 
                  ιστορικής μορφής της οδού Μεραρχίας στις Σέρρες.

                  Μέσα από τη συλλογή, οργάνωση και ανάλυση ιστορικού αρχειακού 
                  υλικού, καθώς και την ερμηνεία ιστορικών χαρτών και φωτογραφιών, 
                  επιχειρείται η ανασύσταση ενός αστικού τοπίου που δεν είναι πλέον 
                  ορατό στη σημερινή πόλη.

                  Η εφαρμογή λειτουργεί ως ψηφιακό αποθετήριο και διαδραστικό εργαλείο 
                  εξερεύνησης, συνδυάζοντας γεωχωρική απεικόνιση και τρισδιάστατη 
                  αναπαράσταση για την κατανόηση της ιστορικής συνέχειας και της 
                  μεταβολής του αστικού χώρου.
                </p>

                <p className="info-body">
                  Το έργο παρουσιάστηκε στο 1ο Πανελλήνιο Συνέδριο Συλλόγου 
                  Αρχιτεκτόνων Σερρών «Η αρχιτεκτονική της πόλης και νέοι ορίζοντες. 
                  Σέρρες ±100» (2025).

                  Η σχετική δημοσίευση με τίτλο 
                  «Η οδός Μεραρχίας ως άξονας ιστορικής συνέχειας. Μία ψηφιακή προσέγγιση»
                  είναι διαθέσιμη στα πρακτικά του συνεδρίου.

                  <br />

                   <a 
                    href="https://www.academia.edu/171051744/%CE%97_%CE%BF%CE%B4%CF%8C%CF%82_%CE%9C%CE%B5%CF%81%CE%B1%CF%81%CF%87%CE%AF%CE%B1%CF%82_%CF%89%CF%82_%CE%AC%CE%BE%CE%BF%CE%BD%CE%B1%CF%82_%CE%B9%CF%83%CF%84%CE%BF%CF%81%CE%B9%CE%BA%CE%AE%CF%82_%CF%83%CF%85%CE%BD%CE%AD%CF%87%CE%B5%CE%B9%CE%B1%CF%82_%CE%9C%CE%AF%CE%B1_%CF%88%CE%B7%CF%86%CE%B9%CE%B1%CE%BA%CE%AE_%CF%80%CF%81%CE%BF%CF%83%CE%AD%CE%B3%CE%B3%CE%B9%CF%83%CE%B7?source=swp_share"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="info-conference"
                  >
                    Προβολή δημοσίευσης ↗
                  </a>
                </p>
              </div>

              <div className="info-divider" />

              <div className="info-section">
                <h2 className="info-section-title">Ομάδα</h2>

                <div className="info-team-grid">
                  {TEAM.map((member, i) => (
                    <div key={i} className="info-team-member">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="info-team-avatar"
                      />
                      <span className="info-team-name">
                        {member.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="info-divider" />

              <div className="info-section">
                <a
                  href="https://f8studio.gr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="info-studio-link"
                >
                  f8studio.gr
                </a>

                <div className="info-contact-items">
                  <a href="mailto:hello@f8studio.gr" className="info-contact-item">
                    hello@f8studio.gr
                  </a>
                  <a href="tel:+302321052185" className="info-contact-item">
                    +30 232 105 2185
                  </a>
                </div>
              </div>

              <div className={`info-bottom-fade ${showFade ? "visible" : ""}`} />

            </div>
          </div>
        </div>
      )}

     
        <button
          className="info-reopen"
          onClick={() => setOpen(true)}
        >
          i
        </button>
     
    </>
  );
}