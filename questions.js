window.quizQuestions = [
  {
    q: "Which AI-assisted professional work is outside the scope of the charter?",
    source: "Scope - the charter applies to all AI-assisted work, including text, code, spreadsheet formulas, data cleaning and analysis, calculations, visuals, and any other professional use of generative AI.",
    correct: 4,
    options: [
      {
        text: "Drafting text for a client memo.",
        why: "Incorrect. The Scope expressly includes AI-assisted text, so this activity is covered by the charter."
      },
      {
        text: "Generating spreadsheet formulas for an analysis file.",
        why: "Incorrect. The Scope expressly includes spreadsheet formulas, calculations, data cleaning, and analysis."
      },
      {
        text: "Creating or editing a visual element with AI.",
        why: "Incorrect. The Scope expressly includes visuals prepared with artificial intelligence."
      },
      {
        text: "Using AI to help with code or calculations.",
        why: "Incorrect. The Scope expressly includes code and calculations."
      },
      {
        text: "None of the above.",
        why: "Correct. All listed professional AI-assisted uses fall within the charter."
      }
    ]
  },
  {
    q: "A consultant wants to use a new AI browser extension that is not listed in Appendix 1. What is the charter-compliant answer?",
    source: "Rule 1 and Appendix 1 - use only tools listed in Appendix 1, or otherwise approved in writing by Advancy. Unapproved AI tools, AI browsers, search features, or AI add-ons are not allowed.",
    correct: 2,
    options: [
      {
        text: "It is allowed if the extension is free and used only for work.",
        why: "Incorrect. Rule 1 does not approve a tool because it is free; the tool must be listed or approved in writing by Advancy."
      },
      {
        text: "It is allowed if no confidential client data is entered.",
        why: "Incorrect. Even without confidential data, Rule 1 still requires an approved tool for professional work."
      },
      {
        text: "It is not allowed unless it is listed in Appendix 1 or approved in writing by Advancy.",
        why: "Correct. This follows Rule 1 and the Appendix 1 approval requirement."
      },
      {
        text: "It is allowed if the output is later pasted into an approved tool.",
        why: "Incorrect. Using an unapproved AI tool is itself barred; later handling of the output does not cure the tool breach."
      },
      {
        text: "It is allowed if a project manager gives informal verbal approval.",
        why: "Incorrect. Rule 1 requires listing in Appendix 1 or written approval by Advancy."
      }
    ]
  },
  {
    q: "A team wants to paste a few unlabeled figures from a live M&A process into an approved AI tool. What should they do?",
    source: "Rule 2 and Examples - never use AI for market-sensitive information. If the original information is market-sensitive, it remains forbidden even after removing labels.",
    correct: 1,
    options: [
      {
        text: "Proceed because the figures are unlabeled.",
        why: "Incorrect. The charter says removing labels does not make market-sensitive information allowed."
      },
      {
        text: "Do not use AI because the information comes from a live M&A process.",
        why: "Correct. Live M&A process information is market-sensitive, and market-sensitive information is absolutely prohibited."
      },
      {
        text: "Proceed if only three figures are used.",
        why: "Incorrect. The not-allowed examples state that even three figures from a live sensitive process remain forbidden."
      },
      {
        text: "Proceed if the tool is approved.",
        why: "Incorrect. Approved tools may still not be used for market-sensitive information."
      },
      {
        text: "Proceed if the output is used only internally.",
        why: "Incorrect. The prohibition concerns transmitting market-sensitive input to AI; internal-only use does not create an exception."
      }
    ]
  },
  {
    q: "A client contract expressly forbids AI use, third-party processing, or cloud processing. Which answer is correct?",
    source: "Rule 2 - never use AI where a client, contract, or non-disclosure agreement expressly forbids AI use, third-party processing, or cloud processing.",
    correct: 3,
    options: [
      {
        text: "Use AI if the mission is otherwise Green.",
        why: "Incorrect. Rule 2 is an absolute prohibition and overrides ordinary Green mission permissions."
      },
      {
        text: "Use AI if only a short extract is pasted.",
        why: "Incorrect. A short extract does not override an express contractual or NDA prohibition."
      },
      {
        text: "Use AI if the tool is in Appendix 1.",
        why: "Incorrect. Approved-tool status does not override an express client, contract, or NDA prohibition."
      },
      {
        text: "Do not use AI for the barred material.",
        why: "Correct. The charter states that the express contractual restriction prevails."
      },
      {
        text: "Use AI if the prompt asks the model not to store the data.",
        why: "Incorrect. Prompt wording does not remove an express prohibition on AI use or processing."
      }
    ]
  },
  {
    q: "Can an Advancy consultant share access to an approved AI account or session with a family member, friend, or unauthorized person?",
    source: "Rule 3 - approved tools are for Advancy personnel only. Do not share access, prompts, files, outputs, or sessions with unauthorized persons.",
    correct: 0,
    options: [
      {
        text: "No, approved tools and sessions are reserved for Advancy personnel.",
        why: "Correct. Rule 3 expressly forbids sharing access, prompts, files, outputs, or sessions with unauthorized people."
      },
      {
        text: "Yes, if the person does not see client names.",
        why: "Incorrect. Rule 3 prohibits unauthorized sharing regardless of whether client names are visible."
      },
      {
        text: "Yes, if the session is used outside office hours.",
        why: "Incorrect. Rule 3 contains no outside-hours exception."
      },
      {
        text: "Yes, if the consultant remains responsible for the output.",
        why: "Incorrect. Human responsibility does not authorize sharing an approved tool or session with unauthorized persons."
      },
      {
        text: "Yes, if only generic prompts are shared.",
        why: "Incorrect. Rule 3 also prohibits sharing prompts and sessions with unauthorized persons."
      }
    ]
  },
  {
    q: "A consultant wants to upload a full Advancy report or benchmark to an approved AI tool. What does the charter say?",
    source: "Rule 4 - do not upload a full Advancy report, benchmark, methodology, or internal knowledge asset. Only a limited extract of up to 10 pages may be used if no other restriction applies.",
    correct: 2,
    options: [
      {
        text: "It is allowed if the tool is approved.",
        why: "Incorrect. Rule 4 independently prohibits uploading full Advancy proprietary materials."
      },
      {
        text: "It is allowed if the document is internal and not client-owned.",
        why: "Incorrect. Rule 4 specifically protects full Advancy reports, benchmarks, methodologies, and internal knowledge assets."
      },
      {
        text: "It is not allowed; only a limited necessary extract of up to 10 pages may be used if no other restriction applies.",
        why: "Correct. This is the exact practical limit set by Rule 4."
      },
      {
        text: "It is allowed if the output is not shared externally.",
        why: "Incorrect. The prohibition is on uploading the full proprietary material, not only on external sharing."
      },
      {
        text: "It is allowed if the report is converted to images first.",
        why: "Incorrect. Changing file format does not avoid the prohibition on full proprietary materials."
      }
    ]
  },
  {
    q: "When may a five-page extract of an Advancy methodology be used with AI?",
    source: "Rule 4 and allowed examples - a limited extract of up to 10 pages may be used only if it is genuinely necessary and no other restriction applies.",
    correct: 4,
    options: [
      {
        text: "Always, because it is below 10 pages.",
        why: "Incorrect. The charter also requires the extract to be necessary and subject to no other restriction."
      },
      {
        text: "Never, because all Advancy methodology content is barred.",
        why: "Incorrect. Rule 4 allows a limited extract of up to 10 pages if necessary and otherwise permitted."
      },
      {
        text: "Only if it is from a Red mission.",
        why: "Incorrect. Red mission content cannot be transmitted to AI at all."
      },
      {
        text: "Only if it is pasted into an unapproved tool to avoid storing it in an approved workspace.",
        why: "Incorrect. Rule 1 requires approved tools; using an unapproved tool is not allowed."
      },
      {
        text: "When the extract is limited, genuinely necessary, under 10 pages, and no other restriction applies.",
        why: "Correct. This mirrors Rule 4 and the allowed example."
      }
    ]
  },
  {
    q: "What is required before using personal or sensitive data in an AI tool?",
    source: "Rule 5 - do not use personal or sensitive data unless the legal framework and internal approval are in place.",
    correct: 1,
    options: [
      {
        text: "Only remove names and email addresses.",
        why: "Incorrect. Rule 5 requires the legal framework and internal approval, not only surface anonymization."
      },
      {
        text: "Ensure the legal framework and internal approval are in place.",
        why: "Correct. This is the explicit condition in Rule 5."
      },
      {
        text: "Use the data if the mission is Green.",
        why: "Incorrect. A Green mission remains subject to all general rules, including Rule 5."
      },
      {
        text: "Use the data if the AI output is reviewed afterward.",
        why: "Incorrect. Human review is mandatory but does not replace the special clearance required for personal or sensitive data."
      },
      {
        text: "Use the data if the prompt says the information is sensitive.",
        why: "Incorrect. Labeling the prompt does not establish the legal framework or internal approval required by Rule 5."
      }
    ]
  },
  {
    q: "At the start of each mission, who must classify the mission as Green, Orange, or Red and communicate it to the team?",
    source: "Rule 6 - at the start of each mission, the Manager or Principal must classify the mission as Green, Orange, or Red and communicate that classification to the team.",
    correct: 2,
    options: [
      {
        text: "Each consultant classifies their own tasks independently.",
        why: "Incorrect. Rule 6 assigns mission classification to the Manager or Principal."
      },
      {
        text: "The AI tool decides based on the prompt content.",
        why: "Incorrect. The charter requires human mission classification by the Manager or Principal."
      },
      {
        text: "The Manager or Principal.",
        why: "Correct. Rule 6 states this role explicitly."
      },
      {
        text: "Only Advancy Legal can classify every mission.",
        why: "Incorrect. The charter says the Manager or Principal classifies the mission; Legal is consulted when there is doubt or risk."
      },
      {
        text: "Classification is optional if the team uses approved tools.",
        why: "Incorrect. Rule 6 says every mission must be classified at the start."
      }
    ]
  },
  {
    q: "A consultant has not yet received the Green, Orange, or Red classification for a mission. What should they do before using AI on mission material?",
    source: "Rule 6 - if the classification has not yet been communicated, consultants must ask the Manager or Principal before using AI on any mission material.",
    correct: 0,
    options: [
      {
        text: "Ask the Manager or Principal before using AI on mission material.",
        why: "Correct. Rule 6 gives this exact instruction."
      },
      {
        text: "Assume the mission is Green until told otherwise.",
        why: "Incorrect. The charter requires asking first when classification has not been communicated."
      },
      {
        text: "Use AI only for short extracts.",
        why: "Incorrect. Extract size does not replace the mandatory mission classification step."
      },
      {
        text: "Use AI only if the output will not be sent to the client.",
        why: "Incorrect. Rule 6 applies before using AI on mission material, regardless of sharing destination."
      },
      {
        text: "Use AI if the material appears non-sensitive.",
        why: "Incorrect. The charter says to ask before using AI on any mission material if classification is missing."
      }
    ]
  },
  {
    q: "What does a Green mission classification mean?",
    source: "Mission classification table - Green means no mission-specific AI restriction beyond the general rules of the charter.",
    correct: 3,
    options: [
      {
        text: "AI may be used without any review.",
        why: "Incorrect. Rule 7 still requires consultant review and validation of AI-prepared work."
      },
      {
        text: "Full Advancy reports may be uploaded.",
        why: "Incorrect. Green missions remain subject to Rule 4's restriction on full Advancy proprietary materials."
      },
      {
        text: "Any AI tool may be used.",
        why: "Incorrect. Green missions still require approved tools under Rule 1."
      },
      {
        text: "Approved AI tools may be used for normal work, subject to all other charter rules.",
        why: "Correct. This is the practical rule for Green missions."
      },
      {
        text: "Client contractual restrictions no longer matter.",
        why: "Incorrect. Rule 2's contractual and NDA prohibition still applies."
      }
    ]
  },
  {
    q: "On an Orange mission, the Manager has marked certain documents and topics as off-limits for AI. A consultant is unsure whether a data point is permitted. What should happen?",
    source: "Mission classification table - Orange missions are partially restricted. If there is any doubt, do not use AI until the Manager or Principal confirms that the material is permitted.",
    correct: 4,
    options: [
      {
        text: "Use AI because Orange is not fully Red.",
        why: "Incorrect. Orange missions can contain off-limits material, and the Manager-defined restriction prevails."
      },
      {
        text: "Use AI if the data point is small.",
        why: "Incorrect. Size does not override an Orange restriction or uncertainty."
      },
      {
        text: "Use AI if the prompt does not mention the client name.",
        why: "Incorrect. Removing a name does not confirm that the material is permitted."
      },
      {
        text: "Use AI first, then tell the Manager.",
        why: "Incorrect. The charter requires confirmation before use when there is doubt."
      },
      {
        text: "Do not use AI until the Manager or Principal confirms the material is permitted.",
        why: "Correct. This is the Orange mission practical rule."
      }
    ]
  },
  {
    q: "What is the practical AI rule on a Red mission?",
    source: "Mission classification table - Red missions are fully restricted. No mission-related document, data, or information may be pasted, uploaded, summarized, or otherwise transmitted to any AI tool.",
    correct: 1,
    options: [
      {
        text: "Only client-confidential documents are barred; mission context can still be typed into prompts.",
        why: "Incorrect. The Red rule covers any mission-related document, data, or information."
      },
      {
        text: "No mission-related information may be transmitted to any AI tool; public web search is allowed only if no mission-related information is entered.",
        why: "Correct. This follows the Red mission rule exactly."
      },
      {
        text: "AI may be used if the tool is approved and the output is reviewed.",
        why: "Incorrect. Red mission restrictions bar mission-related inputs even in approved tools and even with review."
      },
      {
        text: "AI may summarize Red mission documents if the summary is not shared.",
        why: "Incorrect. The Red rule expressly forbids summarizing mission-related information with AI."
      },
      {
        text: "AI may be used for Red mission material after anonymization.",
        why: "Incorrect. The not-allowed examples state there is no anonymization or extract-based exception, including for Red missions."
      }
    ]
  },
  {
    q: "A mission classification was set at the beginning, but a live negotiation starts later. What does the charter require?",
    source: "Mission classification section - classification must be set at the beginning of the mission and updated if the situation changes.",
    correct: 2,
    options: [
      {
        text: "Keep the initial classification unchanged for administrative simplicity.",
        why: "Incorrect. The charter requires updating the classification if the situation changes."
      },
      {
        text: "Let each consultant decide whether the change matters.",
        why: "Incorrect. Mission classification is a Manager or Principal responsibility, not an individual guess."
      },
      {
        text: "Update the classification if the situation changes.",
        why: "Correct. This is expressly required by the classification section."
      },
      {
        text: "Continue using AI until Legal issues a written stop notice.",
        why: "Incorrect. The charter requires classification updates and, if in doubt, stopping and asking before use."
      },
      {
        text: "Use AI only on previously created documents.",
        why: "Incorrect. The charter focuses on current mission classification and restrictions, not document creation date."
      }
    ]
  },
  {
    q: "A consultant uses AI to prepare text, a visual, a calculation, or a file for work. What must happen before use or sharing?",
    source: "Rule 7 - any text, document, visual element, calculation, or file prepared with AI must be reviewed and validated by the consultant before use or sharing. When sources matter, sources must also be verified.",
    correct: 0,
    options: [
      {
        text: "The consultant must review and validate it; when sources matter, the consultant must verify the sources.",
        why: "Correct. This restates Rule 7."
      },
      {
        text: "No review is needed if the output is well formatted.",
        why: "Incorrect. Rule 7 makes review and validation mandatory regardless of formatting quality."
      },
      {
        text: "Review is needed only for client deliverables, not internal files.",
        why: "Incorrect. Rule 7 covers AI-prepared text, documents, visuals, calculations, and files before use or sharing."
      },
      {
        text: "Only the AI provider needs to validate the output.",
        why: "Incorrect. The charter places validation responsibility on the consultant."
      },
      {
        text: "Sources do not need verification if the model lists citations.",
        why: "Incorrect. Rule 7 requires source verification when sources matter."
      }
    ]
  },
  {
    q: "Which scenario is allowed under the charter's simple decision rule?",
    source: "Simple decision rule - allowed: Green mission, or permitted Orange material, using approved tools and subject to the rest of the charter.",
    correct: 2,
    options: [
      {
        text: "Red mission content entered into an approved tool.",
        why: "Incorrect. The simple decision rule says Red mission content is not allowed."
      },
      {
        text: "Orange material that the Manager has marked off-limits.",
        why: "Incorrect. Orange restricted material is not allowed."
      },
      {
        text: "Permitted Orange material entered into an approved tool, with all other charter rules followed.",
        why: "Correct. This matches the allowed side of the simple decision rule."
      },
      {
        text: "A full Advancy benchmark entered into ChatGPT Business.",
        why: "Incorrect. Full Advancy proprietary materials are not allowed even in approved tools."
      },
      {
        text: "Output shared without validation because it came from an approved tool.",
        why: "Incorrect. Output shared without validation is listed as not allowed."
      }
    ]
  },
  {
    q: "Which scenario is not allowed under the charter's simple decision rule?",
    source: "Simple decision rule - not allowed: any Red mission content, Orange restricted material, market-sensitive or contractually barred material, any unapproved tool, or any output shared without validation.",
    correct: 4,
    options: [
      {
        text: "Summarizing public articles with an approved tool and validating the wording.",
        why: "Incorrect. This is generally allowed, subject to source and wording validation."
      },
      {
        text: "Using AI on a Green mission for routine synthesis, with consultant validation.",
        why: "Incorrect. This is allowed if no other rule bars the material."
      },
      {
        text: "Using a permitted Orange document after Manager confirmation.",
        why: "Incorrect. Permitted Orange material can be used if other charter rules are followed."
      },
      {
        text: "Using a necessary five-page Advancy methodology extract with no other restriction.",
        why: "Incorrect. Rule 4 allows limited necessary extracts up to 10 pages if no other restriction applies."
      },
      {
        text: "Sharing AI output without consultant validation.",
        why: "Correct. The simple decision rule lists any output shared without validation as not allowed."
      }
    ]
  },
  {
    q: "What is the charter's practical test for market-sensitive information?",
    source: "Market-sensitive information section - if a leak could affect value, negotiations, creditor discussions, workforce discussions, market perception, or the success of a live process, treat it as market sensitive.",
    correct: 1,
    options: [
      {
        text: "Information is market-sensitive only if it contains a listed-company ticker.",
        why: "Incorrect. The charter's test is broader than listed-company identifiers."
      },
      {
        text: "If a leak could affect value, negotiations, creditor discussions, workforce discussions, market perception, or the success of a live process, treat it as market-sensitive.",
        why: "Correct. This is the practical market-sensitive test in the charter."
      },
      {
        text: "Information is market-sensitive only if it is formally labeled confidential.",
        why: "Incorrect. The charter uses a practical leak-impact test, not only labels."
      },
      {
        text: "Information is market-sensitive only after a client sends a written notice.",
        why: "Incorrect. The charter requires treating information as market-sensitive based on the impact of a leak."
      },
      {
        text: "Information is market-sensitive only if it is personal data.",
        why: "Incorrect. Personal or sensitive data is covered separately; market sensitivity includes live value, negotiation, creditor, workforce, perception, and process risks."
      }
    ]
  },
  {
    q: "How long does the market-sensitive prohibition apply, and what is the role of a confidentiality agreement?",
    source: "Market-sensitive information section - the prohibition applies as long as the relevant process, negotiation, or discussion is ongoing. A confidentiality agreement alone does not extend this red line; an express prohibition on AI use, third-party processing, or cloud processing does.",
    correct: 3,
    options: [
      {
        text: "It applies forever to any information ever covered by an NDA.",
        why: "Incorrect. The charter says a confidentiality agreement alone does not extend the market-sensitive red line."
      },
      {
        text: "It applies only until the first client meeting ends.",
        why: "Incorrect. The charter says it applies as long as the relevant process, negotiation, or discussion is ongoing."
      },
      {
        text: "It applies only if the information is also personal data.",
        why: "Incorrect. Market-sensitive information is not limited to personal data."
      },
      {
        text: "It applies while the relevant process, negotiation, or discussion is ongoing; a separate express AI/cloud-processing ban must also be respected.",
        why: "Correct. This follows the duration rule and the distinction between confidentiality alone and express AI or processing prohibitions."
      },
      {
        text: "It stops applying once labels and company names are removed.",
        why: "Incorrect. The charter says market-sensitive information remains forbidden even when labels are removed."
      }
    ]
  },
  {
    q: "Which Appendix 1 statement is correct?",
    source: "Appendix 1 - approved tools include ChatGPT Business, OpenAI API in the company-approved API workspace, Claude Enterprise, Crunched company license within Excel, and Auxi company license within PowerPoint.",
    correct: 0,
    options: [
      {
        text: "ChatGPT Business is approved as a general business chatbot.",
        why: "Correct. Appendix 1 lists ChatGPT Business for general business chatbot use."
      },
      {
        text: "Any personal ChatGPT account is approved if used by an Advancy consultant.",
        why: "Incorrect. Appendix 1 specifies ChatGPT Business, not any personal account."
      },
      {
        text: "Any OpenAI API key is approved for any automation.",
        why: "Incorrect. Appendix 1 limits OpenAI API use to the company-approved API workspace and approved internal workflows, automations, and integrations."
      },
      {
        text: "Any AI PowerPoint add-in is approved because PowerPoint assistance is allowed.",
        why: "Incorrect. Appendix 1 lists Auxi with a company license within PowerPoint, not any add-in."
      },
      {
        text: "Any AI Excel assistant is approved if the workbook stays local.",
        why: "Incorrect. Appendix 1 lists Crunched with a company license within Excel; Rule 1 still requires approved tools."
      }
    ]
  },
  {
    q: "How should due diligence or transaction material involving a listed company or another sensitive live transaction be treated?",
    source: "Market-sensitive information section - any due diligence or transaction material involving a listed company or another sensitive live transaction counts as market-sensitive information.",
    correct: 2,
    options: [
      {
        text: "It may be used with AI if the company name is removed.",
        why: "Incorrect. The charter gives no anonymization exception for market-sensitive information."
      },
      {
        text: "It may be used with AI if only public-company information is involved.",
        why: "Incorrect. The listed example covers due diligence or transaction material involving a listed company or sensitive live transaction."
      },
      {
        text: "It must not be used with AI because it is market-sensitive.",
        why: "Correct. The charter expressly classifies this material as market-sensitive."
      },
      {
        text: "It may be used with AI if the mission was initially Green.",
        why: "Incorrect. Market-sensitive information is an absolute prohibition and classification must be updated if the situation changes."
      },
      {
        text: "It may be used with AI if the output stays inside Advancy.",
        why: "Incorrect. The prohibition concerns entering market-sensitive material into AI, not only external sharing."
      }
    ]
  },
  {
    q: "A team has banking, debt, refinancing, or covenant information while lender discussions are underway or a breach is near. What is the charter position?",
    source: "Market-sensitive information examples - banking, debt, financing, or covenant information is market-sensitive when lender discussions are ongoing or a breach is near.",
    correct: 4,
    options: [
      {
        text: "AI use is allowed if only ratios are pasted.",
        why: "Incorrect. The charter bars market-sensitive information, and ratio extracts can still reveal debt or covenant issues."
      },
      {
        text: "AI use is allowed if the lender names are removed.",
        why: "Incorrect. Removing names does not remove the market-sensitive nature of the information."
      },
      {
        text: "AI use is allowed if the team needs a formula quickly.",
        why: "Incorrect. Convenience does not override the market-sensitive prohibition."
      },
      {
        text: "AI use is allowed if the prompt is in a private chat.",
        why: "Incorrect. Approved or private tool settings do not override Rule 2's prohibition on market-sensitive information."
      },
      {
        text: "AI use is not allowed because the information is market-sensitive in that context.",
        why: "Correct. This is one of the charter's explicit market-sensitive categories."
      }
    ]
  },
  {
    q: "How should a restructuring plan, collective redundancy plan, or similar sensitive workforce matter be treated for AI use?",
    source: "Market-sensitive information examples - sensitive employment restructuring information, including restructuring plans and collective redundancy plans, is market-sensitive. The not-allowed examples call it market-sensitive and highly sensitive employment information.",
    correct: 1,
    options: [
      {
        text: "It may be pasted if employee names are removed.",
        why: "Incorrect. The charter treats sensitive workforce matters as market-sensitive; removing names is not an exception."
      },
      {
        text: "It must not be pasted into AI because it is market-sensitive and highly sensitive employment information.",
        why: "Correct. This follows the market-sensitive examples and the not-allowed examples."
      },
      {
        text: "It may be pasted if the goal is only to improve wording.",
        why: "Incorrect. The prohibition applies to transmitting the sensitive information to AI, regardless of task type."
      },
      {
        text: "It may be pasted if the mission is not a transaction.",
        why: "Incorrect. The charter separately identifies sensitive workforce matters as market-sensitive."
      },
      {
        text: "It may be pasted if the output is validated by a consultant.",
        why: "Incorrect. Mandatory validation does not override the market-sensitive prohibition."
      }
    ]
  },
  {
    q: "A consultant wants to summarize public articles about an industry or a public company using an approved tool. What does the charter say?",
    source: "Allowed examples - summarizing public articles is allowed because the information is public, but the consultant must validate the wording and, when relevant, the sources before use or sharing.",
    correct: 0,
    options: [
      {
        text: "It is allowed, with wording validation and source verification when relevant.",
        why: "Correct. This mirrors the allowed example in the charter."
      },
      {
        text: "It is never allowed because public-company information is always market-sensitive.",
        why: "Incorrect. The charter allows public-article summaries; market sensitivity depends on the live-process leak-impact test and listed examples."
      },
      {
        text: "It is allowed in any AI tool because the information is public.",
        why: "Incorrect. Rule 1 still requires approved tools."
      },
      {
        text: "It is allowed without review because the articles are public.",
        why: "Incorrect. The allowed example still requires validating wording and sources when relevant."
      },
      {
        text: "It is allowed to mix the public articles with Red mission context.",
        why: "Incorrect. Red mission-related information may not be entered into any AI tool."
      }
    ]
  },
  {
    q: "If a consultant is unsure whether information is Green, Orange-restricted, Red, market-sensitive, or contractually barred, what should they do?",
    source: "If in doubt, stop and ask - do not paste or upload it yet. Ask the Manager or Principal and Advancy Legal or Information Technology first. Report any suspected risky use or data breach immediately.",
    correct: 3,
    options: [
      {
        text: "Proceed with AI after removing names and labels.",
        why: "Incorrect. The charter says if in doubt, do not paste or upload it yet; anonymization is not enough."
      },
      {
        text: "Proceed if the AI tool is approved.",
        why: "Incorrect. Approved-tool status does not resolve uncertainty about classification, restrictions, market sensitivity, or contractual bars."
      },
      {
        text: "Proceed but delete the prompt afterward.",
        why: "Incorrect. The charter requires stopping and asking before pasting or uploading; deletion afterward is not the control."
      },
      {
        text: "Do not paste or upload it yet; ask the Manager or Principal and Advancy Legal or Information Technology first, and report suspected risky use or data breach immediately.",
        why: "Correct. This is the exact escalation rule in the charter."
      },
      {
        text: "Ask the AI tool whether the material is safe to use.",
        why: "Incorrect. The charter requires escalation to Advancy human decision makers, not relying on the AI tool for permission."
      }
    ]
  }
];
