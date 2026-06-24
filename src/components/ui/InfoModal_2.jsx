import { useState } from "react";
import "../../app/styles/infoModal.css";

const TEAM = [
  { name: "Κυριάκος Ρόντσης", photo: "https://map.f8studio.gr/Photos/app-nocodb/team/team-Kyriakos.jpg" },
  { name: "Αθανασία Λαντούρη", photo: "https://map.f8studio.gr/Photos/app-nocodb/team/team-Athanasia-1.jpg" },
  { name: "Ελένη Μαργούδη", photo: "https://map.f8studio.gr/Photos/app-nocodb/team/team-Eleni.jpg" },
  { name: "Γιώργος Μερτζανίδης", photo: null },
  { name: "Ηρακλής Τζαρίδης", photo: "https://map.f8studio.gr/Photos/app-nocodb/team/team-Iraklis_2.jpg" },
  { name: "Αλέξης Χατζόγλου", photo: "https://map.f8studio.gr/Photos/app-nocodb/team/team-Alex.jpg" },
  { name: "Γιώργος Βάκαλος", photo: null },
  { name: "Yutseng Wu", photo: "https://map.f8studio.gr/Photos/app-nocodb/team/team-YutsengWu_2.jpg" },
];

export default function InfoModal() {
  const [open, setOpen] = useState(true);

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

            {/* Scrollable inner — fills modal height, clips at edges */}
            <div className="info-scroll">

              {/* Intro */}
              <div className="info-section">
                <div className="info-logo">
                  <span className="info-logo-text">About</span>
                </div>
                <p className="info-body">
                  Το Project αποτελεί μια ερευνητική πρωτοβουλία με στόχο τη μελέτη και 
                  την ψηφιακή τεκμηρίωση της ιστορικής μορφής της πόλης των Σερρών. 
                  Μέσα από τη συλλογή, οργάνωση και συσχέτιση ιστορικών χαρτών, φωτογραφιών, 
                  αρχειακών τεκμηρίων και άλλων πηγών, επιχειρείται η διερεύνηση της εξέλιξης 
                  του αστικού τοπίου και η ανάδειξη στοιχείων της τοπικής ιστορίας που δεν είναι πλέον ορατά στο σύγχρονο περιβάλλον.
                  </p>
                  <p className="info-body">
                  Η παρούσα εφαρμογή λειτουργεί ως ψηφιακό αποθετήριο και εργαλείο εξερεύνησης του ερευνητικού υλικού. 
                  Οι πληροφορίες που παρουσιάζονται αποτελούν μέρος μιας ευρύτερης προσπάθειας ψηφιακής 
                  ανασύστασης της οδού Μεραρχίας πριν από την εφαρμογή του πολεοδομικού σχεδίου του 1925, 
                  με στόχο τη δημιουργία μιας τεκμηριωμένης αναπαράστασης του ιστορικού αστικού τοπίου των Σερρών.
                </p>
              </div>

              <div className="info-divider" />

              {/* Team */}
              <div className="info-section">
                <h2 className="info-section-title">Ομαδα</h2>
                <div className="info-team-grid">
                  {TEAM.map((member, i) => (
                    <div key={i} className="info-team-member">
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="info-team-avatar"
                        />
                      ) : (
                        <div className="info-team-avatar" />
                      )}
                      <span className="info-team-name">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="info-divider" />

              {/* Studio + contact */}
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
                  <a
                    href="https://f8studio.gr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="info-contact-item"
                  >
                    f8studio.gr
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {!open && (
        <button
          className="info-reopen"
          onClick={() => setOpen(true)}
          aria-label="About this project"
        >
          i
        </button>
      )}
    </>
  );
}