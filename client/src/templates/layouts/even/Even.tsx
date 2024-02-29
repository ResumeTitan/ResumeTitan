import React from 'react';

interface ResumeData {
  basics: {
    name: string;
    title: string;
    summary: string;
    location: string;
    email: string;
    twitter: string;
    github: string;
  };
  work: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    location: string;
    description: string;
    stack: string[];
  }[];
  education: {
    institution: string;
    studyType: string;
    startDate: string;
    endDate: string;
  }[];
  awards: {
    title: string;
    awardedBy: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  interests: string[];
  references: {
    text: string;
    author: string;
    position: string;
    company: string;
  }[];
}

interface Props {
  resume: ResumeData;
}

const ResumeComponent: React.FC<Props> = ({ resume }) => {
  return (
    <html lang="en" style={{}}>
      <head>
        <title>{resume.basics.name}</title>
        <meta name="description" content={resume.basics.summary} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap"
        />
        {/* Add your inline styles here */}
      </head>
      <body>
        <header className="masthead">
          <img
            src="https://avatars0.githubusercontent.com/u/416209?s=460&u=38f220a2c9c658141804f881c334c594eb1642ac&v=4"
            alt=""
          />
          <div>
            <h1>{resume.basics.name}</h1>
            <h2>{resume.basics.title}</h2>
          </div>
          <article>
            <p>{resume.basics.summary}</p>
          </article>
          <ul className="icon-list">
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-map-pin"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {resume.basics.location}
            </li>
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-mail"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <a href={`mailto:${resume.basics.email}`}>{resume.basics.email}</a>
            </li>
            {/* Add other contact information */}
          </ul>
        </header>
        {/* Add other sections */}
      </body>
    </html>
  );
};

export default ResumeComponent;
