import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, ChevronRight } from 'lucide-react';

const DOMAIN_DESCRIPTIONS = {
  'Professional Engagement': {
    title: 'Professional Engagement',
    description: 'Engage in the healthcare quality profession with a commitment to practicing ethically, enhancing one\'s competence and advancing the field.',
    color: '#7B1FA2',
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
    color: '#1E5BB8',
    competencies: [
      'Direct the quality infrastructure to achieve organizational objectives',
      'Apply procedures to regulate the use of privileged or confidential information',
      'Implement processes to promote stakeholder engagement and interprofessional teamwork',
      'Create learning opportunities to advance healthcare quality throughout the organization',
      'Communicate effectively with different audiences to achieve quality goals',
    ],
    examples: 'Develop quality governance structures, establish cross-functional committees, lead quality council meetings, align organizational quality goals with strategic objectives.'
  },
  'Performance & Process Improvement': {
   title: 'Performance & Process Improvement',
    description: 'Use performance and process improvement, project management and change management methods to support quality initiatives.',
    color: '#0F6C74',
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
    color: '#2E7D32',
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
    color: '#8A6D3B',
    competencies: [
      'Apply procedures for the governance of data assets',
      'Design data collection plans for key metrics and performance indicators',
      'Acquire data from source systems',
      'Integrate data from internal and external electronic data systems',
      'Use statistical and visualization methods',
    ],
    examples: 'Create data dashboards, establish data quality standards, conduct performance benchmarking, analyze trends, inform evidence-based decision making.'
  },
  'Patient Safety': {
    title: 'Patient Safety',
    description: 'Cultivate a safe healthcare environment by promoting safe practices, nurturing a just culture and improving processes that detect, mitigate or prevent harm.',
    color: '#E67E22',
    competencies: [
      "Assess the organization's patient safety culture",
      'Apply safety science principles and methods in healthcare quality work',
      'Use organizational procedures to identify and report patient safety risks and events',
      'Collaborate with stakeholders to analyze patient safety risks and events',
    ],
    examples: 'Implement safety culture assessments, establish incident reporting systems, conduct root cause analyses, design error prevention strategies, promote psychological safety in teams.'
  },
  'Regulatory & Accreditation': {
   title: 'Regulatory & Accreditation',
    description: 'Direct organization-wide processes for evaluating, monitoring and improving compliance with internal and external requirements.',
    color: '#C62828',
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
    color: '#AD1457',
    competencies: [
      'Relate current and emerging payment models to healthcare quality work',
      'Conduct the activities to execute measure requirements',
      'Implement processes to facilitate practitioner performance review activities',
    ],
    examples: 'Maintain reporting systems, ensure timely compliance submissions, track quality metrics, communicate performance to stakeholders.'
  },
};

const COMPETENCY_DESCRIPTIONS = {
  // Professional Engagement
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
    description: 'Actively contribute to the growth and advancement of the healthcare quality profession through involvement in professional communities and activities.',
    skillLevels: {
      foundational: 'You attend professional events and are aware of opportunities to contribute to the profession.',
      proficient: 'You volunteer in professional associations, contribute to publications, and mentor others entering the field.',
      advanced: 'You lead professional organizations, shape the direction of the profession, and advocate for healthcare quality at a national or international level.',
    },
  },
  // Quality Leadership and Integration
  'Direct the quality infrastructure to achieve organizational objectives': {
    description: 'Lead and manage the quality infrastructure to align with and achieve organizational strategic goals.',
    skillLevels: {
      foundational: 'You understand basic quality infrastructure components and can discuss fundamental approaches to quality governance.',
      proficient: 'You manage quality governance structures, align quality activities with organizational goals, and oversee quality committees.',
      advanced: 'You design and evaluate the entire quality infrastructure, mentor quality leaders, and drive culture change around quality at an enterprise level.',
    },
  },
  'Apply procedures to regulate the use of privileged or confidential information': {
    description: 'Implement and follow procedures to protect privileged and confidential quality-related information.',
    skillLevels: {
      foundational: 'You understand the importance of protecting privileged information and are aware of relevant policies.',
      proficient: 'You apply data governance and confidentiality procedures consistently and train staff on their responsibilities.',
      advanced: 'You design organizational policies for managing privileged information and advise leaders on risk mitigation related to confidentiality.',
    },
  },
  'Implement processes to promote stakeholder engagement and interprofessional teamwork': {
    description: 'Develop and sustain processes that foster collaboration among stakeholders and interprofessional teams.',
    skillLevels: {
      foundational: 'You understand stakeholder engagement concepts and can identify key collaborators for quality initiatives.',
      proficient: 'You establish and facilitate interprofessional teams, manage communication across stakeholders, and sustain engagement throughout projects.',
      advanced: 'You design organization-wide engagement strategies, develop team capabilities, and mentor others in stakeholder engagement leadership.',
    },
  },
  'Create learning opportunities to advance healthcare quality throughout the organization': {
    description: 'Design and deliver educational experiences that build quality competencies across the organization.',
    skillLevels: {
      foundational: 'You identify learning needs and understand how education supports quality improvement.',
      proficient: 'You develop and deliver quality education programs, assess learning outcomes, and tailor content to different audiences.',
      advanced: 'You design comprehensive organizational learning strategies, evaluate program effectiveness, and lead a culture of continuous quality education.',
    },
  },
  'Communicate effectively with different audiences to achieve quality goals': {
    description: 'Adapt communication approaches to effectively engage diverse audiences and advance quality objectives.',
    skillLevels: {
      foundational: 'You understand the importance of tailoring messages and can communicate quality data in basic formats.',
      proficient: 'You craft targeted communications for different audiences—clinical staff, executives, patients—and use varied formats and channels.',
      advanced: 'You design organizational communication strategies for quality, coach others in quality communication, and lead executive-level quality reporting.',
    },
  },
  // Performance and Process Improvement
  'Implement standard performance and process improvement (PPI) methods': {
    description: 'Apply established performance and process improvement methodologies to drive quality outcomes.',
    skillLevels: {
      foundational: 'You understand PPI frameworks (PDSA, Lean, Six Sigma) and can participate in structured improvement projects.',
      proficient: 'You lead improvement initiatives using standard PPI methods, manage timelines, track progress, and implement effective changes.',
      advanced: 'You design improvement strategies across the organization, mentor others in PPI leadership, and ensure sustainable results.',
    },
  },
  'Apply project management methods': {
    description: 'Use project management principles and tools to plan, execute, and monitor quality improvement initiatives.',
    skillLevels: {
      foundational: 'You understand project management basics and can contribute to project teams in a defined role.',
      proficient: 'You manage quality projects from initiation to close, using structured project management tools and tracking mechanisms.',
      advanced: 'You develop project management frameworks for quality programs, mentor project leads, and oversee a portfolio of improvement initiatives.',
    },
  },
  'Use change management principles and tools': {
    description: 'Apply change management frameworks to successfully navigate and sustain organizational changes related to quality.',
    skillLevels: {
      foundational: 'You understand the principles of change management and recognize barriers to change in healthcare settings.',
      proficient: 'You apply change management tools to quality initiatives, engage stakeholders, and address resistance to change.',
      advanced: 'You design change management strategies for complex, large-scale quality transformations and coach leaders in managing change effectively.',
    },
  },
  // Population Health and Care Transitions
  'Integrate population health management strategies into quality work': {
    description: 'Apply population health management approaches to improve health outcomes for defined patient populations.',
    skillLevels: {
      foundational: 'You understand population health concepts and can identify how they connect to quality improvement.',
      proficient: 'You develop and implement population health strategies, monitor outcomes, and engage community stakeholders.',
      advanced: 'You lead population health programs, evaluate their impact, and integrate findings into organizational quality strategy.',
    },
  },
  'Apply a holistic approach to improvement': {
    description: 'Consider the full continuum of care and diverse patient needs when designing and implementing quality improvements.',
    skillLevels: {
      foundational: 'You recognize the importance of considering social, clinical, and operational factors in quality work.',
      proficient: 'You design improvements that address patient, family, community, and system-level factors comprehensively.',
      advanced: 'You lead system-wide holistic improvement strategies, ensuring equity, access, and whole-person care are central to quality initiatives.',
    },
  },
  'Collaborate with stakeholders to improve care processes and transitions': {
    description: 'Partner with diverse stakeholders to redesign and enhance care coordination across settings and transitions.',
    skillLevels: {
      foundational: 'You understand care transition challenges and can identify key stakeholders involved in care coordination.',
      proficient: 'You collaborate with multidisciplinary teams to redesign care transition processes and monitor outcomes.',
      advanced: 'You lead enterprise-wide care transition improvement initiatives, evaluate outcomes, and influence policy to support seamless care.',
    },
  },
  // Health Data Analytics
  'Apply procedures for the governance of data assets': {
    description: 'Establish and implement procedures for the governance of data assets.',
    skillLevels: {
      foundational: 'You are knowledgeable about governance practices in the organization—knowing whether a data governance committee exists, specific policies, data dictionaries, and security protocols.',
      proficient: 'You contribute to data definitions and dictionaries, identify governance policy gaps, and help document secure data management practices.',
      advanced: 'You establish organizational data governance policies, promote data governance value, and advise leaders on proper use of data for decision making.',
    },
  },
  'Design data collection plans for key metrics and performance indicators': {
    description: 'Create data collection plans to support quality, safety, regulatory, and patient experience work activities.',
    skillLevels: {
      foundational: 'You help define measure types and understand best practices for data collection and the concepts of validity and reliability.',
      proficient: 'You develop measures using standard definitions, create operational definitions, and implement data collection methods with appropriate sampling.',
      advanced: 'You establish benchmarks, evaluate collection methods for accuracy, and coach others in measurement and data gathering methodologies.',
    },
  },
  'Acquire data from source systems': {
    description: 'Extract and obtain data from various organizational information systems and databases.',
    skillLevels: {
      foundational: 'You understand data extraction standards and can identify key data systems for quality measurement and improvement.',
      proficient: 'You extract data from various systems, integrate diverse datasets, ensure accuracy, and document data specifications.',
      advanced: 'You evaluate data sources, design technical specifications for data integration, and merge data for advanced reporting.',
    },
  },
  'Integrate data from internal and external electronic data systems': {
    description: 'Integrate data from internal and external source systems to support quality, safety, regulatory, and patient experience.',
    skillLevels: {
      foundational: 'You understand best practice standards for data extraction and can identify key systems and how they connect to support quality efforts.',
      proficient: 'You collaborate with subject matter experts to define data sources, integrate diverse datasets (EHR, claims, surveys), and ensure accuracy and timeliness.',
      advanced: 'You evaluate data sources and technical specifications across clinical, financial, and operational areas and merge data for comprehensive reporting.',
    },
  },
  'Use statistical and visualization methods': {
    description: 'Use statistical and visualization methods to transform data into information.',
    skillLevels: {
      foundational: 'You describe how statistical tools are used to evaluate data quality and patterns and understand how to create basic visualizations.',
      proficient: 'You perform statistical analyses, create visualizations (bar graphs, run charts, control charts), and help others interpret findings to drive action.',
      advanced: 'You design data quality tests, perform complex statistical analysis, and mentor others in using data effectively for quality and safety improvement.',
    },
  },
  // Patient Safety
  "Assess the organization's patient safety culture": {
    description: "Assess the organization's patient safety culture and safety practices.",
    skillLevels: {
      foundational: 'You understand elements that contribute to a safety culture and collect information related to patient safety surveys.',
      proficient: 'You assist in applying safety culture surveys, analyze outcomes to discern trends, and make recommendations to leadership.',
      advanced: 'You design macro-level plans for safety culture improvement, evaluate safety plan effectiveness, and synthesize survey findings for all stakeholders.',
    },
  },
  'Apply safety science principles and methods in healthcare quality work': {
    description: 'Apply safety science principles and methods to healthcare quality and safety work.',
    skillLevels: {
      foundational: 'You identify safety science principles in healthcare and understand that reliable systems and safeguards are needed to reduce risk.',
      proficient: 'You design safety improvements with frontline staff, applying safety science principles with the understanding that errors often result from system flaws.',
      advanced: 'You develop comprehensive strategic safety plans across care pathways and lead efforts that may influence policies at state, national, and international levels.',
    },
  },
  'Use organizational procedures to identify and report patient safety risks and events': {
    description: 'Use organizational procedures to identify and report patient and workplace safety risks and events.',
    skillLevels: {
      foundational: 'You recognize the importance of notifying the organization of safety risks impacting patients, staff, and organizational reputation.',
      proficient: 'You partner with diverse team members to obtain comprehensive perspectives so that thorough risk reduction plans can be implemented.',
      advanced: 'You establish patient and workplace safety plans, seek leadership support, and disseminate performance goals and discussions of unfavorable events.',
    },
  },
  'Collaborate with stakeholders to analyze patient safety risks and events': {
    description: 'Collaborate with internal and external stakeholders to analyze safety risks and events to improve processes.',
    skillLevels: {
      foundational: 'You engage in risk assessment activities related to actual, near-miss, or repeat patient safety events.',
      proficient: 'You facilitate interprofessional interactions and tools to create effective interventions that meet organizational priorities.',
      advanced: 'You co-design plans with leadership, coach others to analyze safety risks, and apply science-based methods to prevent errors and build reliable systems.',
    },
  },
  // Regulatory and Accreditation
  'Operationalize processes to support compliance with regulations and standards': {
    description: 'Develop and implement processes to ensure ongoing compliance with applicable regulations and accreditation standards.',
    skillLevels: {
      foundational: 'You understand regulatory agencies affecting your organization and can research specific compliance requirements.',
      proficient: 'You implement and monitor compliance processes, interpret regulatory requirements, and provide staff education on standards.',
      advanced: 'You design organizational compliance frameworks, evaluate their effectiveness, and advise executives on regulatory risk and strategy.',
    },
  },
  'Facilitate continuous survey readiness activities': {
    description: 'Lead ongoing activities to ensure the organization is continuously prepared for regulatory surveys and accreditation assessments.',
    skillLevels: {
      foundational: 'You understand survey readiness programs and can identify key stakeholders involved in the readiness process.',
      proficient: 'You implement survey readiness processes, conduct mock surveys, provide training, and monitor ongoing compliance.',
      advanced: 'You develop comprehensive readiness frameworks, evaluate all aspects of the readiness program, and coach team members in survey preparation.',
    },
  },
  'Guide the organization through survey processes and findings': {
    description: 'Lead the organization through external surveys and the remediation of findings to achieve and maintain accreditation.',
    skillLevels: {
      foundational: 'You understand the survey process and can support activities during and after an external survey.',
      proficient: 'You coordinate survey logistics, communicate with surveyors, manage findings, and develop corrective action plans.',
      advanced: 'You lead all aspects of survey management, evaluate organizational performance, and drive systemic improvements based on survey findings.',
    },
  },
  // Quality Review and Accountability
  'Relate current and emerging payment models to healthcare quality work': {
    description: 'Connect knowledge of payment models and value-based care to quality measurement and improvement activities.',
    skillLevels: {
      foundational: 'You understand the relationship between payment models and quality and can identify key quality measures tied to reimbursement.',
      proficient: 'You align quality work with value-based payment requirements, monitor performance on relevant measures, and communicate implications to stakeholders.',
      advanced: 'You lead strategy around value-based care quality performance, evaluate financial implications of quality outcomes, and advise leadership on payment model trends.',
    },
  },
  'Conduct the activities to execute measure requirements': {
    description: 'Implement all activities necessary to meet quality measure specifications and reporting requirements.',
    skillLevels: {
      foundational: 'You understand measure specifications and can participate in data collection and reporting activities.',
      proficient: 'You manage the full cycle of measure execution including data collection, validation, submission, and performance monitoring.',
      advanced: 'You design measure management systems, oversee compliance across all required measures, and lead performance improvement efforts tied to measure results.',
    },
  },
  'Implement processes to facilitate practitioner performance review activities': {
    description: 'Design and manage processes to support peer review and practitioner performance evaluation activities.',
    skillLevels: {
      foundational: 'You understand the purpose and structure of peer review and practitioner performance review processes.',
      proficient: 'You coordinate peer review activities, manage documentation, and support practitioners and committees through the review process.',
      advanced: 'You design practitioner performance review frameworks, evaluate their effectiveness, and advise leadership on performance management policy.',
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

              {/* Description - only show for domains */}
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