import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
// import html2pdf from "html2pdf.js";
import Spinner from "../../components/Spinner";
import { getResume } from "../../api/resume";

import './styles.css';
import './screen.css';
import './print.css';
import './paper.css';

const MED_SCREEN_WIDTH = 768;

/**
 * Resume Page content
 * @param id Resume ID to display
 * @returns Resume page content
 */
function Resume() {
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [resume, setResume] = useState();

  const resumeRef = React.useRef();

  const [showAlert, setShowAlert] = useState(false);
  const [ackAlert, setAckAlert] = useState(false);
  const [resumeData, setResumeData] = useState(resume);
  console.log(resumeData);

  useEffect(() => {
    const resumeIn = getResume(token, user._id);
    console.log(resumeIn);
    setResume(resumeIn);
    const handleResize = () => {
      if (window.innerWidth < MED_SCREEN_WIDTH) {
        setShowAlert(true);
      } else {
        setShowAlert(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    console.log(resumeRef.current);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSaveAsPDF = async () => {
    const element = resumeRef.current;

    if (element) {
      const opt = {
        margin: 0,
        filename: 'my_component.pdf',
        image: { type: 'jpeg', quality: 0.99 },
        html2canvas: { scale: 1 },
        // jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      // html2pdf().set(opt).from(element).save();
      // TODO fix
      console.log("PDF saving disabled");
    }
  };

  if (showAlert && !ackAlert) {
    return (
      <div className="bg-yellow-200 border-yellow-500 border-4 p-4">
        <p className="font-bold">Warning</p>
        <p>This page may not display properly on small screens.</p>
        <button className="resume" onClick={() => setAckAlert(true)}>OK</button>
      </div>
    )
  }

  const handleEdit = (field, value) => {
    setResumeData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = document.querySelector('.print-container').cloneNode(true);
    printWindow.document.open();
    console.log(printContent.outerHTML);
    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <link rel="stylesheet" type="text/css" href="./styles.css" />
          <link rel="stylesheet" type="text/css" media="screen" href="./screen.css" />
          <link rel="stylesheet" type="text/css" media="print" href="./print.css" />
          <link rel="stylesheet" type="text/css" href="./paper.css" />
          <style>
            @page { size: auto; }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
          <script>
            setTimeout(() => {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }, 100);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="m-2">
      {false && <Spinner />}
      {resume && (
      <div className="letter">
        <section id="save">
          <section className="sheet print-container">
            <aside>
              <section className="contact">
                <h6>Contact</h6>
                <ul>
                  <li>
                    <p><i className="fa fa-map-marker-alt" title="Location"></i> San Francisco, CA</p>
                    </li>
                    <li>
                      <p><i className="fa fa-phone" title="Cell phone"></i> <a href="tel:4153234000">(415) 323-4000</a></p>
                    </li>
                    <li>
                      <p><i className="fa fa-envelope" title="Email"></i> <a href="mailto:joe@joesmith.site">joe@joesmith.site</a></p>
                    </li>
                    <li>
                      <p><i className="fa fa-globe-americas" title="Website"></i> <a href="https://joesmith.site">joesmith.site</a></p>
                    </li>
                    <li>
                      <p><i className="fab fa-github" title="GitHub"></i> <a href="https://github.com/Tombarr">github.com/Tombarr</a></p>
                    </li>
                  </ul>
                </section>
                <section className="skills">
                  <h6>Skills</h6>
                  <ul>
                    <li><span>Responsive Design</span></li>
                    <li><span>Mobile Development</span></li>
                    <li><span>Usability Testing</span></li>
                    <li><span>Data Visualization</span></li>
                    <li><span>A/B Testing</span></li>
                  </ul>
                </section>
                <section className="skills">
                  <h6>Technologies</h6>
                  <ul>
                    <li><span>JavaScript</span></li>
                    <li><span>PHP</span></li>
                    <li><span>HTML5</span></li>
                    <li><span>CSS3</span></li>
                    <li><span>Bootstrap</span></li>
                    <li><span>React</span></li>
                  </ul>
                </section>
                <section className="references">
                  <h6>References</h6>
                  <address>
                    Jane Doe<br />
                    Alphabet Inc.<br />
                    (413) 025-1900
                    jane@janedoe.site
                  </address>
                  <address>
                    Luke O'Connor<br />
                    Facebook<br />
                    (413) 125-1400
                    luke@facebook.site
                  </address>
                    <p>Typeset in HTML &amp; CSS<br />
                    See <a href="https://git.io/f4dXp">git.io/f4dXp</a></p>
                </section>
              </aside>
              <section className="information">
                <header className="name" aria-label="Joe Smith">
                  <a href="https://joesmith.site">
                    <svg width="257px" height="35px" viewBox="0 0 257 35" version="1.1" xmlns="http://www.w3.org/2000/svg">
                      <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" fontFamily="Montserrat-Regular, Montserrat" fontSize="48" fontWeight="normal">
                        <g id="Letter" transform="translate(-54.000000, -140.000000)" fill="#484848">
                          <text id="JOE-SMITH">
                            <tspan x="54.728" y="174">JOE SMITH</tspan>
                          </text>
                        </g>
                      </g>
                    </svg>
                  </a>
                  <h6>Software Engineer Extraordinaire</h6>
                  <hr />
                </header>
                <section>
                  <section className="summary">
                    <h6>Summary</h6>
                    <p>Deadline-oriented software engineer with lots of experience.
                      Solid track record of architecting solutions that exceed client expectations.</p>
                  </section>
                  <section className="experience">
                    <h6>Experience</h6>
                    <ol>
                      <li>
                        <header>
                          <p className="sanserif">Senior Software Engineer</p>
                          <time>2016 - Present</time>
                        </header>
                        <span>Google</span>
                        <ul>
                          <li>Developed scalable database indexing technology</li>
                          <li>Created GraphQL APIs for accessing Google Earth</li>
                          <li>Leveraged Waymo datasets to double traffic statistics accuracy</li>
                        </ul>
                      </li>
                      <li>
                        <header>
                          <p className="sanserif">Software Engineer</p>
                          <time>2014 - 2016</time>
                        </header>
                        <span>Facebook</span>
                        <ul>
                          <li>Collected political affiliation data from millions of users</li>
                          <li>Authored user stories and mapped user journeys</li>
                          <li>Introduced regression testing to Yoga layout framework</li>
                        </ul>
                      </li>
                      <li>
                        <header>
                          <p className="sanserif">Software Engineer Intern</p>
                          <time>2013 - 2014</time>
                        </header>
                        <span>Twitter</span>
                        <ul>
                          <li>Analyzed and optimized code coverage across Scala architecture</li>
                          <li>Created project environment setup XML files</li>
                          <li>Maintained TCP/IP connections with 250,000 concurrent users</li>
                        </ul>
                      </li>
                      <li>
                        <header>
                          <p className="sanserif">Independent iOS Engineer</p>
                          <time>2012 - Present</time>
                        </header>
                        <ul>
                          <li>Developed SuperUltraCoolWeather app using AccuWeather API</li>
                          <li>Shipped products to more than 1,000,000 daily active users</li>
                        </ul>
                      </li>
                    </ol>
                  </section>
                  <section className="education">
                    <h6>Education</h6>
                    <ol>
                      <li>
                        <div>
                          <p className="sanserif">M.S., Human Computer Interaction</p>
                          <time>Sept '12 - May '14</time>
                        </div>
                        <div>
                          <span>Massachusetts Institute of Technology</span>
                          <span></span>
                        </div>
                      </li>
                      <li>
                        <div>
                          <p className="sanserif">B.S., Computer Science</p>
                          <time>Sept '08 - May '12</time>
                        </div>
                        <div>
                          <span>Harvard University</span>
                          <span>GPA: 3.91</span>
                        </div>
                      </li>
                    </ol>
                  </section>
                </section>
              </section>
            </section>
          </section>
        </div>
      )}
      <div className="flex justify-center items-center">
        <button
          className="submitButton bg-slate-800" 
          onClick={handlePrint}>Download as PDF</button>
      </div>
    </div>
  );    
}
  
export default Resume;
