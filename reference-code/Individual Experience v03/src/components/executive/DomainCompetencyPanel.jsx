import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, ChevronRight } from 'lucide-react';

const DOMAIN_DESCRIPTIONS = {
  'Professional Engagement': {
   title: 'Professional Engagement',
   description: 'Engage in the healthcare quality profession with a commitment to practicing ethically, enhancing one\'s competence and advancing the field.',
   color: '#6B4C9A',
   competencies: [
     'Integrate ethical standards into healthcare quality practice',
     'Engage in lifelong learning as a healthcare quality professional',
     'Participate in activities that advance the healthcare quality profession',
   ],
   examples: 'Pursue professional development, adhere to ethical standards, participate in professional associations, contribute to the field\'s knowledge and practice.'
  },
  'Quality Leadership & Integration': {
   title: 'Quality Leadership & Integration',
   description: 'Advance the organization\'s commitment to healthcare quality through collaboration, learning opportunities and communication. Lead the integration of quality into the fabric of the organization through a coordinated infrastructure to achieve organizational objectives.',
   color: '#003DA5',
   competencies: [
     'Direct the quality infrastructure to achieve organizational objectives',
     'Apply procedures to regulate the use of privileged or confidential information',
     'Implement processes to promote stakeholder engagement and interprofessional teamwork',
     'Communicate effectively with different audiences to achieve quality goals',
   ],
   examples: 'Develop quality governance structures, establish cross-functional committees, lead quality council meetings, align organizational quality goals with strategic objectives.'
  },
  'Performance & Process Improvement': {
   title: 'Performance & Process Improvement',
   description: 'Use performance and process improvement, project management and change management methods to support quality initiatives.',
   color: '#00B5E2',
   competencies: [
     'Implement standard performance and process improvement (PPI) methods',
     'Apply project management methods',
     'Use change management principles and tools',
   ],
   examples: 'Lead LEAN and Six Sigma projects, apply Plan-Do-Study-Act cycles, manage process redesign initiatives, navigate organizational change, monitor improvement metrics.'
  },
  'Population Health & Care Transitions': {
   title: 'Population Health & Care Transitions',
   description: 'Evaluate and improve healthcare processes and care transitions to advance the efficient, effective and safe care of defined populations.',
   color: '#8BC53F',
   competencies: [
     'Integrate population health management strategies into quality work',
     'Apply a holistic approach to improvement',
     'Collaborate with stakeholders to improve care processes and transitions',
   ],
   examples: 'Develop care pathways, implement care coordination programs, monitor population health metrics, improve transitions between care settings.'
  },
  'Health Data Analytics': {
    title: 'Health Data Analytics',
    description: 'Leverage the organization\'s analytic environment to help guide data driven decision making and inform quality improvement initiatives.',
    color: '#F68B1F',
    competencies: [
      'Apply procedures for the management of data and systems',
      'Design data collection and data analysis plans',
      'Integrate data from internal and external source systems',
      'Use statistical and visualization methods',
    ],
    examples: 'Create data dashboards, establish data quality standards, conduct performance benchmarking, analyze trends, inform evidence-based decision making.'
  },
  'Patient Safety': {
   title: 'Patient Safety',
   description: 'Cultivate a safe healthcare environment by promoting safe practices, nurturing a just culture and improving processes that detect, mitigate or prevent harm.',
   color: '#009CA6',
   competencies: [
     'Assess the organization\'s patient safety culture',
     'Apply safety science principles and methods in healthcare quality work',
     'Use organizational procedures to identify and report patient safety risks and events',
     'Collaborate with stakeholders to analyze patient safety risks and events',
   ],
   examples: 'Implement safety culture assessments, establish incident reporting systems, conduct root cause analyses, design error prevention strategies, promote psychological safety in teams.'
  },
  'Regulatory & Accreditation': {
   title: 'Regulatory & Accreditation',
   description: 'Direct organization-wide processes for evaluating, monitoring and improving compliance with internal and external requirements.',
   color: '#ED1C24',
   competencies: [
     'Operationalize processes to support compliance with regulations and standards',
     'Facilitate continuous survey readiness activities',
     'Guide the organization through survey processes and findings',
   ],
   examples: 'Maintain regulatory tracking systems, prepare for Joint Commission surveys, respond to compliance findings, develop corrective action plans, ensure ongoing adherence to standards.'
  },
  'Quality Review & Accountability': {
   title: 'Quality Review & Accountability',
   description: 'Direct activities that support compliance with voluntary, mandatory and contractual reporting requirements.',
   color: '#99154B',
   competencies: [
     'Relate current and emerging payment models to healthcare quality work',
     'Conduct the activities to execute measure requirements',
     'Implement processes to facilitate practitioner performance review activities',
   ],
   examples: 'Maintain reporting systems, ensure timely compliance submissions, track quality metrics, communicate performance to stakeholders.'
  },
};

const COMPETENCY_DESCRIPTIONS = {
    'Integrate ethical standards into healthcare quality practice': {
      description: 'Exercise ethical standards and integrate them into professional practice that support healthcare quality and safety.',
      skillLevels: {
        foundational: 'You exercise a general understanding of what a code of ethics is and how it relates to your work.',
        proficient: 'You consistently and effectively apply the code of ethics in practice, which requires not only understanding but also value judgment and critical decision-making skills.',
        advanced: 'You have not only mastered the application of ethics to practice but also are able to evaluate how well policies and procedures align with the code of ethics and support the professional development of others in advancing their competencies.',
      },
    },
    'Engage in lifelong learning as a healthcare quality professional': {
      description: 'Engage in lifelong learning to advance healthcare quality and safety.',
      skillLevels: {
        foundational: 'You engage with professional associations to develop an understanding of the profession and the contribution professionals make to those they serve.',
        proficient: 'You participate in association certification programs. Certification is often the gateway to volunteering as a subject matter expert.',
        advanced: 'You give back to the profession that has challenged and sustained you throughout your career and volunteer at the highest levels of a professional organization.',
      },
    },
    'Participate in activities that advance the healthcare quality profession': {
      description: 'Contribute to the advancement of the healthcare quality profession through engagement and leadership.',
      skillLevels: {
        foundational: 'You understand the importance of professional contribution and can identify ways to participate in the profession.',
        proficient: 'You actively participate in professional organizations, contribute to knowledge sharing, and mentor newer professionals.',
        advanced: 'You lead professional initiatives, influence professional standards, and shape the direction of the healthcare quality field.',
      },
    },
   'Apply procedures for the management of data and systems': {
     description: 'Establish and implement procedures for the governance of data assets.',
     skillLevels: {
       foundational: 'You are knowledgeable about governance practices in the organization. For example, the professional at this level knows whether the organization has a data governance committee and knows the specific policies and procedures, availability of data dictionaries and data security protocols.',
       proficient: 'You contribute to the development of data definitions and dictionaries, identify what aspects of established data governance policies need to be updated and help document how data should be managed securely.',
       advanced: 'You establish organizational data governance policies, promote the value of data governance and advise leaders on the proper use of data to drive decision making.',
     },
   },
   'Design data collection and data analysis plans': {
     description: 'Create data collection plans to support quality, safety, regulatory, and patient experience work activities.',
     skillLevels: {
       foundational: 'You help define and explain the types and attributes of measures, including structure, process, and outcome. You also know the best practices for collecting data for improvement initiatives and can discuss the concepts of validity and reliability as they apply to data measurement.',
       proficient: 'You develop measures while using organizational and/or national standard definitions and specifications. You create operational definitions and processes for data collection, thus ensuring consistency and interrater reliability. Additionally, you implement data collection methods through a variety of tools and relevant sampling methodologies.',
       advanced: 'You establish benchmarks or targets for specific measures in the absence of industry standards or relevant historical performance, evaluate data collection methods for effective and accurate data capture and coach others in best practices for measurement and data gathering methodologies.',
     },
   },
   'Integrate data from internal and external source systems': {
     description: 'Integrate data from internal and external source systems to support quality, safety, regulatory, and patient experience.',
     skillLevels: {
       foundational: 'You understand best practice standards for data extraction and can identify key data systems for quality measurement and improvement. You know how to connect clinical, financial, and operational data to support quality efforts.',
       proficient: 'You collaborate with organizational subject matter experts to define data sources and standardization of data for key measures and reporting. You integrate diverse data sets from varying systems (e.g., EHR, claims, patient surveys, and regulatory databases) ensuring accuracy, completeness, and timely availability for advanced analytics to support data informed decisions and improve overall healthcare delivery.',
       advanced: 'You evaluate data sources and technical specifications across clinical, financial, and/or operational areas to identify possible integration for advanced reporting. You merge data from various sources for comprehensive analysis and reporting to support decision making and performance improvement.',
     },
   },
   'Use statistical and visualization methods': {
     description: 'Use statistical and visualization methods to transform data into information.',
     skillLevels: {
       foundational: 'You describe how statistical tests and analytical tools are used to transform and evaluate data quality and patterns. You understand the types of data variation and how to create basic visualizations to turn raw data into useful insights.',
       proficient: 'You perform statistical analyses to summarize the variability of a dataset, generate conclusions and make recommendations based on patterns in the data and create specific visualizations (e.g., bar graphs, run charts, pie charts, control charts, data tables) and help others accurately interpret findings and drive appropriate action.',
       advanced: 'You design tests to determine the completeness and accuracy of data, use statistics to perform complex analysis ensuring data reliability, and mentor others in using data effectively to support quality and safety improvement work efforts.',
     },
   },
   'Apply safety science principles and methods': {
     description: 'Apply safety science principles and methods to healthcare quality and safety work.',
     skillLevels: {
       foundational: 'You identify the safety science principles that apply to the healthcare setting and understand to prevent errors and ensure consistent care, reliable systems, processes, and safeguards are needed to reduce risk and improve outcomes.',
       proficient: 'You design safety improvements in collaboration with frontline staff and stakeholders ensuring safety solutions are reliable and scalable. You apply safety science principles to improve care, understanding human errors are often a result of system flaws.',
       advanced: 'You demonstrate an ability to develop comprehensive strategic safety plans that cover connections across the continuum of health service pathways. You lead efforts with the understanding that not only can the results affect the local environment, they can also influence policies at the state, national, and international levels.',
     },
   },
   'Assess the organization\'s patient safety culture': {
     description: 'Assess the organization\'s patient safety culture and safety practices.',
     skillLevels: {
       foundational: 'You demonstrate an understanding of the elements that contribute to a safety culture for consistent management of errors and collect information related to patient safety surveys.',
       proficient: 'You assist in the application of safety culture surveys and the analysis of survey outcomes to discern trends and patterns. You also make recommendations to your leadership team to help inform decision making.',
       advanced: 'You design macro-level plans to address safety culture improvement opportunities, evaluate the effectiveness of safety plans, and synthesize information from safety culture survey findings to identify implications for all parties including patients, staff, and providers satisfaction.',
     },
   },
   'Apply safety science principles and methods in healthcare quality work': {
     description: 'Apply safety science principles and methods to healthcare quality and safety work.',
     skillLevels: {
       foundational: 'You identify the safety science principles that apply to the healthcare setting and understand to prevent errors and ensure consistent care, reliable systems, processes, and safeguards are needed to reduce risk and improve outcomes.',
       proficient: 'You design safety improvements in collaboration with frontline staff and stakeholders ensuring safety solutions are reliable and scalable. You apply safety science principles to improve care, understanding human errors are often a result of system flaws.',
       advanced: 'You demonstrate an ability to develop comprehensive strategic safety plans that cover connections across the continuum of health service pathways. You lead efforts with the understanding that not only can the results affect the local environment, they can also influence policies at the state, national, and international levels.',
     },
   },
   'Use organizational procedures to identify and report patient safety risks and events': {
     description: 'Use organizational procedures to identify and report patient and workplace safety risks and events.',
     skillLevels: {
       foundational: 'You recognize the importance of notifying the organization of safety risks, as they impact the patient, staff and organization\'s reputation.',
       proficient: 'You partner with diverse team members to obtain and consider other perspectives so that comprehensive risk reduction plans can be implemented.',
       advanced: 'You establish patient and workplace safety plans seeking support of leadership and administration to disseminate performance goals and discussion of unfavorable events with appropriate audiences for improvement opportunities.',
     },
   },
   'Collaborate with stakeholders to analyze patient safety risks and events': {
     description: 'Collaborate with internal and external stakeholders to analyze safety risks and events to improve processes.',
     skillLevels: {
       foundational: 'You engage in risk assessment activities related to actual, near miss or repeat patient safety events.',
       proficient: 'You facilitate the interprofessional interactions and tools to create effective interventions that meet or exceed the organization priorities.',
       advanced: 'You co-design plans with leadership, coach others to analyze safety risks and understand/apply science-based methods to prevent errors and build reliable systems.',
     },
   },
   'Lead and sponsor quality initiatives': {
     description: 'Direct quality initiatives and provide organizational leadership to advance quality objectives and strategic goals.',
     examples: 'Champion quality improvement projects, allocate resources for quality initiatives, communicate quality priorities, remove barriers to improvement, celebrate successes.',
     skillLevels: {
       foundational: 'Foundational (I KNOW): You understand basic quality initiative leadership and can discuss fundamental approaches to quality management and organizational oversight.',
       proficient: 'Proficient (I DO): You sponsor and oversee quality initiatives, allocate resources effectively, communicate priorities clearly, and work to remove barriers to improvement.',
       advanced: 'Advanced (I LEAD): You develop strategic quality initiatives at an organizational level, mentor other leaders in quality sponsorship, and drive culture change around quality.',
     },
   },
   'Foster a culture of continuous improvement': {
     description: 'Create an organizational environment that values ongoing improvement, learning, and innovation in healthcare quality practices.',
     examples: 'Recognize improvement efforts, provide training on improvement methodologies, embed improvement expectations in performance evaluations, model continuous learning behavior.',
     skillLevels: {
       foundational: 'Foundational (I KNOW): You understand the importance of continuous improvement culture and can identify examples of improvement-oriented practices.',
       proficient: 'Proficient (I DO): You implement improvement culture initiatives, provide training, recognize efforts, and embed improvement into performance expectations.',
       advanced: 'Advanced (I LEAD): You design organization-wide improvement culture strategies, evaluate effectiveness of culture initiatives, and coach leaders on sustaining improvement.',
     },
   },
   'Build and sustain cross-functional teams': {
     description: 'Develop and maintain collaborative teams across departments to support integrated quality improvement efforts.',
     examples: 'Establish multidisciplinary teams, facilitate team communication, resolve conflicts, develop team capabilities, maintain engagement over project lifecycles.',
     skillLevels: {
       foundational: 'Foundational (I KNOW): You understand team dynamics and can identify key stakeholders for cross-functional collaboration.',
       proficient: 'Proficient (I DO): You establish and facilitate cross-functional teams, manage communication, resolve conflicts, and sustain engagement throughout projects.',
       advanced: 'Advanced (I LEAD): You design team structures for complex initiatives, develop team capabilities, and mentor others in cross-functional leadership.',
     },
   },
   'Create and maintain a safe environment': {
     description: 'Establish and sustain processes and practices that promote a safe healthcare environment for patients and staff.',
     examples: 'Implement safety protocols, conduct safety rounds, create reporting mechanisms, provide safety training, foster psychological safety.',
     skillLevels: {
       foundational: 'Foundational (I KNOW): You understand safety principles and can identify safety risks in your environment.',
       proficient: 'Proficient (I DO): You implement safety protocols, conduct safety assessments, create reporting systems, and provide safety training.',
       advanced: 'Advanced (I LEAD): You lead comprehensive safety programs, evaluate safety outcomes, and drive organization-wide safety culture.',
     },
   },
   'Identify and mitigate patient safety risks': {
     description: 'Apply systematic methods to identify, assess, and reduce patient safety risks and adverse events.',
     examples: 'Perform failure mode analysis, conduct hazard assessments, design safeguards, test prevention strategies, monitor risk reduction effectiveness.',
     skillLevels: {
       foundational: 'Foundational (I KNOW): You understand risk identification methods and can recognize common safety risks.',
       proficient: 'Proficient (I DO): You conduct risk assessments, design mitigation strategies, and implement safeguards to reduce patient safety events.',
       advanced: 'Advanced (I LEAD): You design comprehensive risk management programs, analyze complex safety issues, and mentor teams in risk mitigation.',
     },
   },
   'Use data to identify improvement opportunities': {
     description: 'Analyze organizational data to identify areas for quality and process improvement.',
     examples: 'Review performance metrics, identify variation, benchmark against peers, determine root causes of gaps, prioritize improvement areas.',
     skillLevels: {
       foundational: 'Foundational (I KNOW): You understand data analysis concepts and can interpret basic performance metrics.',
       proficient: 'Proficient (I DO): You analyze data to identify gaps, benchmark performance, determine root causes, and prioritize improvement opportunities.',
       advanced: 'Advanced (I LEAD): You design data systems for improvement, evaluate complex data relationships, and guide organization-wide data analytics strategy.',
     },
   },
   'Plan and implement improvement initiatives': {
     description: 'Develop and execute structured improvement projects using standardized methodologies.',
     examples: 'Design improvement plans, manage project timelines, track progress, adapt strategies, sustain improvements over time.',
     skillLevels: {
       foundational: 'Foundational (I KNOW): You understand improvement methodologies and can participate in structured improvement projects.',
       proficient: 'Proficient (I DO): You plan and lead improvement initiatives, manage timelines, track progress, and implement effective changes.',
       advanced: 'Advanced (I LEAD): You design improvement strategies across the organization, mentor others in improvement leadership, and ensure sustainable results.',
     },
   },
   'Apply procedures for governance of data assets': {
     description: 'Establish and implement processes for managing, protecting, and governing organizational data.',
     examples: 'Create data stewardship policies, establish data standards, ensure data security, manage data lifecycle, document data ownership.',
     skillLevels: {
       foundational: 'Foundational (I KNOW): You are knowledgeable about governance practices in the organization and understand data security requirements.',
       proficient: 'Proficient (I DO): You contribute to data governance policies, establish data standards, implement security measures, and manage data lifecycle.',
       advanced: 'Advanced (I LEAD): You establish organizational data governance frameworks, promote data governance value, and advise leaders on data management.',
     },
   },
   'Design data collection plans': {
     description: 'Create comprehensive plans for collecting data on key performance metrics and indicators.',
     examples: 'Define measures, specify data sources, establish collection frequency, ensure data accuracy, document specifications.',
     skillLevels: {
       foundational: 'Foundational (I KNOW): You help define measure types and understand best practices for data collection.',
       proficient: 'Proficient (I DO): You develop measures using standards, create operational definitions, design collection processes, and implement sampling methodologies.',
       advanced: 'Advanced (I LEAD): You establish measurement frameworks, evaluate collection methods, and coach others in measurement best practices.',
     },
   },
   'Acquire data from source systems': {
     description: 'Extract and obtain data from various organizational information systems and databases.',
     examples: 'Query clinical systems, extract administrative data, integrate manual data, validate data completeness, address data quality issues.',
     skillLevels: {
       foundational: 'Foundational (I KNOW): You understand data extraction standards and can identify key data systems for quality measurement.',
       proficient: 'Proficient (I DO): You extract data from various systems, integrate diverse datasets, ensure accuracy, and document data specifications.',
       advanced: 'Advanced (I LEAD): You evaluate data sources, design technical specifications for data integration, and merge data for advanced reporting.',
     },
   },
   'Operationalize processes to support compliance with regulations and standards': {
     description: 'Establish and implement processes to ensure organization-wide compliance with regulatory and accreditation standards.',
     examples: 'Develop compliance processes, establish monitoring systems, document procedures, identify compliance gaps.',
     skillLevels: {
       foundational: 'Foundational (I KNOW): You understand regulatory agencies affecting your organization and can research specific regulatory questions.',
       proficient: 'Proficient (I DO): You independently conduct internal surveys, interpret regulatory requirements, and provide education on compliance.',
       advanced: 'Advanced (I LEAD): You are sought after to review regulatory effects of new initiatives and work with leaders to implement necessary changes.',
     },
   },
   'Facilitate continuous survey readiness activities': {
     description: 'Lead and coordinate ongoing activities to maintain survey readiness and compliance.',
     examples: 'Conduct mock surveys, remediate findings, ensure documentation compliance, train staff, develop readiness metrics.',
     skillLevels: {
       foundational: 'Foundational (I KNOW): You discuss survey readiness programs and can identify key stakeholders for the readiness process.',
       proficient: 'Proficient (I DO): You implement survey readiness processes, conduct mock surveys, provide training, and monitor ongoing compliance.',
       advanced: 'Advanced (I LEAD): You develop comprehensive readiness frameworks, evaluate all aspects of readiness programs, and coach team members.',
     },
   },
   'Guide the organization through survey processes and findings': {
     description: 'Lead the organization in preparing for, executing, and responding to survey processes and accreditation findings.',
     examples: 'Coordinate survey preparation, manage survey participation, analyze findings, develop corrective action plans.',
     skillLevels: {
       foundational: 'Foundational (I KNOW): You understand survey processes and can identify key areas for preparation.',
       proficient: 'Proficient (I DO): You coordinate survey activities, manage stakeholder communication, and address survey findings.',
       advanced: 'Advanced (I LEAD): You lead comprehensive survey strategies, interpret complex findings, and guide organizational response.',
     },
   },
   'Implement standard performance and process improvement (PPI) methods': {
     description: 'Apply structured methodologies to improve organizational performance and healthcare processes.',
     examples: 'Lead LEAN and Six Sigma projects, apply Plan-Do-Study-Act cycles, manage process redesign initiatives, monitor improvement metrics.',
     skillLevels: {
       foundational: 'Foundational (I KNOW): You understand performance and process improvement methodologies and can identify improvement opportunities.',
       proficient: 'Proficient (I DO): You implement PPI methods, lead improvement projects, apply PDSA cycles, and track improvement outcomes.',
       advanced: 'Advanced (I LEAD): You design improvement strategies across the organization, mentor others in PPI methodologies, and ensure sustainable results.',
     },
   },
   'Apply project management methods': {
     description: 'Use structured project management approaches to plan, execute, and close quality initiatives.',
     examples: 'Develop project charters, manage timelines and budgets, track progress, manage stakeholders, close projects effectively.',
     skillLevels: {
       foundational: 'Foundational (I KNOW): You understand project management principles and can support project planning activities.',
       proficient: 'Proficient (I DO): You manage quality improvement projects, coordinate timelines, manage budgets, and communicate progress to stakeholders.',
       advanced: 'Advanced (I LEAD): You oversee complex, multi-phase initiatives, mentor others in project management, and optimize project delivery.',
     },
   },
   'Use change management principles and tools': {
     description: 'Apply change management frameworks to support successful organizational transitions.',
     examples: 'Assess readiness for change, manage resistance, communicate change vision, provide support, measure adoption.',
     skillLevels: {
       foundational: 'Foundational (I KNOW): You understand change management principles and can identify stakeholders affected by change.',
       proficient: 'Proficient (I DO): You apply change management tools, assess readiness, address resistance, and communicate changes effectively.',
       advanced: 'Advanced (I LEAD): You design comprehensive change strategies, mentor leaders in change management, and evaluate change effectiveness.',
     },
   },
   'Integrate population health management strategies into quality work': {
     description: 'Incorporate population health approaches and strategies into quality improvement initiatives.',
     examples: 'Develop population-based interventions, assess health disparities, coordinate cross-continuum care.',
     skillLevels: {
       foundational: 'Foundational (I KNOW): You understand population health concepts and can identify key health indicators.',
       proficient: 'Proficient (I DO): You integrate population health strategies into quality work, analyze population data, and coordinate initiatives.',
       advanced: 'Advanced (I LEAD): You design comprehensive population health strategies, evaluate effectiveness across settings, and guide organizational initiatives.',
     },
   },
   'Apply a holistic approach to improvement': {
     description: 'Consider the full system context and interconnected elements when planning and implementing improvements.',
     examples: 'Map system relationships, identify unintended consequences, engage diverse stakeholders, sustain improvements.',
     skillLevels: {
       foundational: 'Foundational (I KNOW): You understand systems thinking principles and can identify system relationships.',
       proficient: 'Proficient (I DO): You apply systems approaches to improvement, consider interdependencies, and engage stakeholders.',
       advanced: 'Advanced (I LEAD): You design improvement strategies using systems perspectives, evaluate complex interactions, and mentor others.',
     },
   },
   'Collaborate with stakeholders to improve care processes and transitions': {
     description: 'Work with internal and external partners to enhance care processes and support seamless transitions.',
     examples: 'Establish collaborative teams, facilitate stakeholder engagement, align improvement goals across settings.',
     skillLevels: {
       foundational: 'Foundational (I KNOW): You understand collaboration principles and can identify key stakeholders.',
       proficient: 'Proficient (I DO): You facilitate stakeholder collaboration, coordinate care improvements, and monitor transition outcomes.',
       advanced: 'Advanced (I LEAD): You lead collaborative improvement initiatives across multiple settings and mentor teams.',
     },
   },
   'Relate current and emerging payment models to healthcare quality work': {
     description: 'Understand how payment and reimbursement models impact quality initiatives and organizational strategy.',
     examples: 'Analyze payment model impacts, align quality metrics with payment incentives, communicate payment implications.',
     skillLevels: {
       foundational: 'Foundational (I KNOW): You understand basic healthcare payment models and their relationship to quality.',
       proficient: 'Proficient (I DO): You analyze payment models, identify quality implications, and align initiatives accordingly.',
       advanced: 'Advanced (I LEAD): You advise leadership on payment model strategy and integrate payment considerations into quality plans.',
     },
   },
   'Conduct the activities to execute measure requirements': {
     description: 'Manage the implementation of quality measure data collection and reporting requirements.',
     examples: 'Define measure specifications, establish data collection processes, ensure timely reporting, monitor compliance.',
     skillLevels: {
       foundational: 'Foundational (I KNOW): You understand measure requirements and can identify key data needs.',
       proficient: 'Proficient (I DO): You implement measure requirements, manage data collection, and ensure accurate reporting.',
       advanced: 'Advanced (I LEAD): You design measure strategies, optimize data collection, and mentor teams in execution.',
     },
   },
   'Implement processes to facilitate practitioner performance review activities': {
     description: 'Establish systems and processes to support physician and practitioner performance evaluation and improvement.',
     examples: 'Develop performance metrics, establish review processes, provide feedback mechanisms, support improvement planning.',
     skillLevels: {
       foundational: 'Foundational (I KNOW): You understand performance review principles and can identify key performance areas.',
       proficient: 'Proficient (I DO): You implement performance review processes, manage feedback, and support practitioner improvement.',
       advanced: 'Advanced (I LEAD): You design comprehensive performance systems, evaluate effectiveness, and guide organizational implementation.',
     },
   },
   };

export default function DomainCompetencyPanel({ isOpen, onClose, type, name }) {
   const [selectedCompetency, setSelectedCompetency] = React.useState(null);
   const isDomain = type === 'domain' && !selectedCompetency;

   const domainContent = DOMAIN_DESCRIPTIONS[name];
   let content;

   if (isDomain && domainContent) {
     content = domainContent;
   } else if (selectedCompetency) {
     content = {
       title: selectedCompetency,
       isDomainContent: false,
       color: domainContent?.color,
       ...(COMPETENCY_DESCRIPTIONS[selectedCompetency] || { description: 'Learn more about this competency to enhance your capability in this area.' })
     };
   } else {
     content = {
       title: name,
       isDomainContent: false,
       ...(COMPETENCY_DESCRIPTIONS[name] || { description: 'Learn more about this competency to enhance your capability in this area.' })
     };
   }

   const handleBackToDomain = () => {
     setSelectedCompetency(null);
   };

   const handleCompetencyClick = (competency) => {
     setSelectedCompetency(competency);
   };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />
          
          {/* Side Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
             <div 
               className="sticky top-0 px-6 py-5 border-b border-gray-200 flex items-center justify-between"
               style={{ backgroundColor: content.color ? `${content.color}10` : '#F8F9FB' }}
             >
               <div className="flex items-center gap-2 min-w-0">
                 <Info className="w-4 h-4 flex-shrink-0" style={{ color: content.color || '#00A3E0' }} />
                 <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                   {isDomain ? 'Domain' : 'Competency'}
                 </p>
               </div>
               <div className="flex items-center gap-2">
                 {selectedCompetency && (
                   <button
                     onClick={handleBackToDomain}
                     className="flex-shrink-0 p-1 hover:bg-gray-200 rounded-lg transition-colors"
                     title="Back to domain"
                   >
                     <ChevronRight className="w-4 h-4 text-gray-400 rotate-180" />
                   </button>
                 )}
                 <button
                   onClick={onClose}
                   className="flex-shrink-0 p-1 hover:bg-gray-200 rounded-lg transition-colors"
                 >
                   <X className="w-4 h-4 text-gray-400" />
                 </button>
               </div>
             </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Title */}
              <div>
                <h2 
                  className="text-lg font-bold leading-snug mb-2"
                  style={{ color: content.color || '#3D3D3D' }}
                >
                  {content.title}
                </h2>
                {isDomain && (
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
                    Domain Overview
                  </p>
                )}
              </div>

              {/* Description — shown for domains only */}
              {isDomain && (
                <div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {content.description}
                  </p>
                </div>
              )}

              {/* Competencies (for domains) */}
              {isDomain && content.competencies && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-3">Key Competencies</p>
                  <ul className="space-y-2">
                    {content.competencies.map((competency, i) => (
                      <li 
                        key={i} 
                        onClick={() => handleCompetencyClick(competency)}
                        className="flex gap-2 text-xs text-gray-600 cursor-pointer hover:text-[#00A3E0] hover:bg-[#00A3E0]/5 p-2 rounded transition-colors"
                      >
                        <span className="text-gray-300 flex-shrink-0 mt-1">•</span>
                        <span className="flex-1">{competency}</span>
                        <ChevronRight className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skill Levels (for competencies) */}
              {!isDomain && content.skillLevels && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-3">Skill Levels</p>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-[11px] font-semibold text-[#3D3D3D] mb-2">Foundational (I KNOW)</p>
                      <p className="text-[11px] text-gray-600 leading-relaxed">{content.skillLevels.foundational}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-[11px] font-semibold text-[#3D3D3D] mb-2">Proficient (I DO)</p>
                      <p className="text-[11px] text-gray-600 leading-relaxed">{content.skillLevels.proficient}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-[11px] font-semibold text-[#3D3D3D] mb-2">Advanced (I LEAD)</p>
                      <p className="text-[11px] text-gray-600 leading-relaxed">{content.skillLevels.advanced}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer note */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  <strong>Note:</strong> This information is based on the NAHQ Healthcare Quality Competency Framework. For detailed competency and skill statements, visit NAHQ.org/workforce-accelerator.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}