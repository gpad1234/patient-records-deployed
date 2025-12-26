# Healthcare EMR: Future Direction & Technical Specifications

**Document Status:** Strategic Roadmap
**Last Updated:** December 13, 2025
**Version:** 1.0

---

## 1. Executive Summary

This document outlines the strategic evolution of the Patient Records EMR system from a **reactive web application** to a **proactive, autonomous healthcare AI platform** powered by the Model Context Protocol (MCP) and multi-agent AI orchestration.

### Current State (Production)
- ✅ React UI with 7-tab AI dashboard
- ✅ Node.js REST APIs for patient data
- ✅ WebScraperMCPServer (Java) for research integration
- ✅ 102 patient records with demographics & medical history
- ✅ ML prediction engines (LSTM, Random Forest, XGBoost, Gradient Boosting, Cox)
- ✅ Real-time research integration (PubMed, arXiv, ADA guidelines)

### Future Vision
- 🔄 **Native MCP Protocol Implementation** - Direct AI agent integration
- 🔄 **Multi-Agent Orchestration** - Coordinated AI workflows
- 🔄 **Healthcare Knowledge Graph MCP Servers** - Specialized medical data access
- 🔄 **Autonomous Clinical Decision Support** - AI-driven recommendations
- 🔄 **Real-time Clinical Alerts** - Agent-driven monitoring & notifications

---

## 2. Strategic Pillars

### 2.1 MCP Protocol as Foundation
**Rationale:** The Model Context Protocol enables seamless integration of external AI agents (Claude, GPT, specialized healthcare models) without requiring REST API wrappers or custom integration code.

**Benefits:**
- **Standardized Interface:** Consistent tool definition across all services
- **Agent Autonomy:** AI agents can call tools natively without human mediation
- **Composability:** Easy to chain multiple agents for complex workflows
- **Scalability:** Add new MCP servers without modifying existing ones
- **Auditability:** Complete tool call history for compliance tracking

### 2.2 Agentic AI as Execution Engine
**Rationale:** Rather than static recommendations, enable autonomous AI agents to:
- Analyze patient data comprehensively
- Research evidence-based guidelines
- Synthesize recommendations
- Monitor for clinical changes
- Generate alerts and notifications

**Agents Types:**
1. **Research Agent** - Searches medical literature proactively
2. **Clinical Analyzer** - Interprets patient data & trends
3. **Recommendation Agent** - Generates evidence-backed suggestions
4. **Monitoring Agent** - Watches for concerning patterns
5. **Orchestrator Agent** - Coordinates multi-agent workflows

### 2.3 Healthcare Knowledge Specialization
**Rationale:** Build domain-specific MCP servers that expose healthcare knowledge in standardized, agent-accessible format.

**Knowledge Domains:**
- Patient Demographics & History
- Lab Results & Trends
- Medication Interactions
- Clinical Guidelines & Evidence
- Care Pathways
- Adverse Event Reporting

---

## 3. Technical Architecture

### 3.1 MCP Server Ecosystem

#### Current Implementation
```
WebScraperMCPServer (Java)
├── PubMed Tool (via REST wrapper)
├── arXiv Tool (via REST wrapper)
└── ADA Guidelines Tool (via REST wrapper)
```

#### Future: Native MCP Implementation
```
Healthcare MCP Platform
├── Patient Data MCP Server
│   ├── get_patient_by_mrn (query patient by medical record number)
│   ├── list_patients (paginated search)
│   ├── get_patient_history (temporal medical data)
│   └── search_patients (by demographics, conditions)
│
├── Lab Results MCP Server
│   ├── get_lab_results (by patient & date range)
│   ├── get_lab_trends (historical analysis)
│   ├── detect_abnormalities (alerts on threshold violations)
│   └── predict_future_labs (AI forecasting)
│
├── Medication MCP Server
│   ├── get_patient_medications (current & historical)
│   ├── check_interactions (drug-drug, drug-food, drug-condition)
│   ├── find_alternatives (substitute recommendation)
│   └── get_side_effects (adverse reaction tracking)
│
├── Clinical Guidelines MCP Server
│   ├── search_guidelines (by condition, treatment)
│   ├── get_evidence_level (GRADE, Oxford, etc.)
│   ├── find_care_pathways (condition-specific protocols)
│   └── check_contraindications (safety warnings)
│
├── Research MCP Server (Enhanced)
│   ├── search_pubmed (native, not REST wrapper)
│   ├── search_arxiv (AI/ML papers)
│   ├── search_ada (American Diabetes Association)
│   ├── get_patient_research (contextualized by patient condition)
│   └── synthesize_research (AI summary of findings)
│
└── Clinical Alerts MCP Server
    ├── create_alert (for monitoring agent)
    ├── acknowledge_alert (alert resolution)
    ├── get_alert_history (audit trail)
    └── subscribe_alerts (real-time notifications)
```

### 3.2 Agent Orchestration Layer

**Purpose:** Coordinate multiple specialized agents for complex clinical workflows.

```
Patient Data Event
        ↓
   Orchestrator Agent
    ↙      ↓      ↘
Research  Clinical  Monitoring
Agent     Analyzer  Agent
    ↓       ↓       ↓
(Synthesis & Decision Point)
    ↓
Recommendation
Agent
    ↓
Alert System /
Clinical Team
```

**Workflow Example: Glucose Trend Analysis**
1. **Monitoring Agent** (watches patient) → Detects rising glucose trend
2. **Clinical Analyzer Agent** → Reviews patient history, comorbidities, current meds
3. **Research Agent** → Searches latest diabetes management guidelines
4. **Recommendation Agent** → Synthesizes evidence-based suggestions
5. **Alert Agent** → Notifies clinical team with full context

### 3.3 Technology Stack Evolution

| Component | Current | Future |
|-----------|---------|--------|
| **Patient API** | REST (Node.js) | REST + MCP (Node.js) |
| **Lab Results** | Hardcoded/Database | REST + MCP (Python FastAPI) |
| **Medications** | Hardcoded/Database | REST + MCP (Python FastAPI) |
| **Guidelines** | Web scraping only | MCP with cached DB + web scraping |
| **Research** | REST wrapper on Java MCP | Native MCP, multi-source |
| **Alerts** | Manual/UI-driven | MCP-enabled event system |
| **Agent Orchestration** | N/A | Python/JavaScript coordination service |
| **Clinical Workflows** | Manual UI navigation | Autonomous agent orchestration |

---

## 4. Detailed Component Specifications

### 4.1 Patient Data MCP Server

**Language:** Node.js/Python
**Database:** SQLite (current) or PostgreSQL (production upgrade)
**Port:** 3002 (assigned)

```typescript
// MCP Tool Definitions

interface PatientDataMCP {
  // Query tools
  get_patient_by_mrn(mrn: string): Patient
  get_patient_by_id(id: number): Patient
  list_patients(filters?: {age_min?, age_max?, condition?}): Patient[]
  search_patients(query: string): Patient[]
  
  // Historical data
  get_patient_history(patient_id: number, start_date: date): MedicalRecord[]
  get_diagnoses(patient_id: number): Diagnosis[]
  get_comorbidities(patient_id: number): Condition[]
  
  // Temporal analysis
  get_condition_timeline(patient_id: number, condition: string): Timeline
  get_medication_timeline(patient_id: number): Timeline
}
```

**Sample MCP Interaction:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "get_patient_by_mrn",
    "arguments": {
      "mrn": "MRN399741954"
    }
  }
}

Response:
{
  "id": 102,
  "mrn": "MRN399741954",
  "firstName": "Alice",
  "lastName": "Gonzalez",
  "dateOfBirth": "1988-11-07",
  "age": 36,
  "diabetesType": "Type 2",
  "diagnosisDate": "2018-04-02"
}
```

### 4.2 Lab Results MCP Server

**Language:** Python (FastAPI)
**Purpose:** Expose historical lab data and anomaly detection
**Port:** 3003 (assigned)

```python
# Key Tools

get_lab_results(patient_id: int, date_range: DateRange) -> List[LabResult]
get_lab_trends(patient_id: int, test_type: str) -> TrendAnalysis
detect_abnormalities(patient_id: int) -> List[Alert]
predict_glucose_trend(patient_id: int, days_ahead: int) -> Forecast
```

**Abnormality Detection Logic:**
- Threshold violations (e.g., glucose > 250 mg/dL)
- Trend reversals (e.g., creatinine rising 3 consecutive tests)
- Outlier detection (statistical anomaly from patient baseline)

### 4.3 Medication MCP Server

**Language:** Python (FastAPI)
**Data Sources:** 
- Patient medication list (from database)
- Drug interaction database (e.g., DrugBank, NCBI)
- FDA adverse event database (optional)
**Port:** 3004 (assigned)

```python
# Key Tools

get_patient_medications(patient_id: int) -> List[Medication]
check_interactions(drug_list: List[str]) -> List[Interaction]
find_alternatives(drug_name: str, condition: str) -> List[Alternative]
check_contraindications(drug_name: str, patient_id: int) -> List[Warning]
get_side_effect_profile(drug_name: str) -> SideEffectProfile
```

**Data Format Example:**
```json
{
  "drug1": "metformin",
  "drug2": "lisinopril",
  "interaction": "No significant interaction",
  "severity": "none"
}
```

### 4.4 Clinical Guidelines MCP Server

**Language:** Python (FastAPI)
**Data Sources:**
- ADA (American Diabetes Association) guidelines
- AHA/ACC cardiovascular guidelines
- Local evidence-based pathways
**Port:** 3005 (assigned)

```python
# Key Tools

search_guidelines(condition: str, treatment: str) -> List[Guideline]
get_evidence_level(recommendation: str) -> EvidenceLevel
find_care_pathway(diagnosis: str) -> CarePathway
check_contraindication(treatment: str, patient_condition: str) -> Contraindication
get_recommended_monitoring(condition: str) -> MonitoringPlan
```

**Evidence Level Schema:**
```json
{
  "recommendation": "Metformin as first-line for Type 2 diabetes",
  "evidence_level": "A",
  "source": "ADA Standards of Care 2024",
  "url": "https://diabetes.org/..."
}
```

### 4.5 Enhanced Research MCP Server

**Language:** Java (WebScraperMCPServer enhancement)
**Current Implementation:** REST wrapper
**Future Implementation:** Native MCP protocol

```java
// Proposed Native MCP Interface

interface ResearchMCP {
  // Search functions
  List<Paper> searchPubMed(String query, int limit);
  List<Paper> searchArxiv(String query, int limit);
  List<Guideline> searchADA(String query);
  
  // Patient-contextualized search
  List<Paper> getPatientResearch(int patientId, String condition);
  
  // Synthesis
  String synthesizeResearch(List<Paper> papers);
  
  // Caching
  CacheStatus getCacheStatus();
}
```

**Fallback Data System** (already implemented):
- Cached high-quality articles from each source
- Retry logic with exponential backoff
- Graceful degradation when APIs unavailable
- See `webscraper.js` for current implementation

### 4.6 Clinical Alerts MCP Server

**Language:** Node.js/Python
**Purpose:** Event-driven alerting system controlled by agents
**Port:** 3006 (assigned)

```typescript
interface AlertsMCP {
  // Creation
  create_alert(patient_id: int, severity: string, message: string): Alert
  
  // Management
  acknowledge_alert(alert_id: int, acknowledgedBy: string): void
  resolve_alert(alert_id: int, resolution: string): void
  
  // Queries
  get_active_alerts(patient_id?: int): List<Alert>
  get_alert_history(patient_id: int): List<Alert>
  
  // Subscriptions
  subscribe_alerts(criteria: AlertCriteria): Subscription
}
```

**Alert Types:**
- **Immediate:** Critical lab values, medication contraindications (Red)
- **Urgent:** Abnormal trends, guidelines violations (Orange)
- **Routine:** Monitoring reminders, follow-up due (Yellow)
- **Informational:** Research findings, guideline updates (Blue)

---

## 5. Multi-Agent Orchestration Workflows

### 5.1 Glucose Management Workflow

**Trigger:** New glucose reading > 200 mg/dL

```
Step 1: Monitoring Agent
├─ Query: get_lab_results(patient_id, last_7_days)
├─ Detect: Rising trend in glucose
└─ Alert: Escalate to Clinical Analyzer

Step 2: Clinical Analyzer Agent
├─ Query: get_patient_history(patient_id)
├─ Query: get_patient_medications(patient_id)
├─ Query: get_comorbidities(patient_id)
├─ Analyze: Current management effectiveness
└─ Hand-off: Research Agent for latest guidelines

Step 3: Research Agent
├─ Query: search_guidelines("type 2 diabetes", "hyperglycemia")
├─ Query: searchPubMed("glucose management 2024")
├─ Query: search_ada("glycemic targets")
└─ Synthesize: Latest evidence & best practices

Step 4: Recommendation Agent
├─ Input: Patient history + current medications + latest research
├─ Generate: Multiple treatment options
├─ Rank: By evidence level and patient contraindications
├─ Query: check_interactions(new_drugs)
└─ Output: Prioritized recommendations with rationale

Step 5: Alert System
├─ Create alert with full context
├─ Notify: Endocrinologist + Primary Care + Patient
└─ Track: Alert acknowledgment and actions taken
```

### 5.2 Medication Reconciliation Workflow

**Trigger:** Patient check-in or new prescription

```
Orchestrator Agent initiates medication review
    ↓
Medication Agent queries current list & interactions
    ↓
Decision Point: Any contraindications detected?
    ├─ YES → Flag for pharmacist review
    └─ NO → Continue
    ↓
Clinical Agent reviews patient conditions & recent labs
    ↓
Research Agent checks latest drug interaction data
    ↓
Recommendation Agent generates optimization suggestions
    ↓
Alert System notifies pharmacy & clinical team
    ↓
Track: Implementation & outcomes
```

### 5.3 Readmission Risk Stratification Workflow

**Trigger:** Discharge planning or periodic review

```
Monitoring Agent
├─ Collect: Recent hospitalizations, ED visits
├─ Collect: Lab trends, medication compliance signals
├─ Calculate: Readmission risk score (existing ML models)
└─ Threshold: If risk > 30%

Clinical Analyzer Agent
├─ Review: Recent encounter notes
├─ Identify: Key risk factors specific to this patient
├─ Query: check_monitoring_plan(diagnosis)

Research Agent
├─ Search: Evidence on readmission prevention
├─ Query: Clinical pathways for high-risk groups

Recommendation Agent
├─ Generate: Targeted intervention bundle
├─ Examples: Intensive monitoring, patient education, PT/OT
├─ Prioritize: By evidence level

Outcome: Discharge plan enhanced with AI-driven interventions
```

---

## 6. Implementation Phases

### Phase 1: Foundation (Months 1-2)
**Goal:** Convert REST APIs to native MCP protocol

- [ ] Refactor WebScraperMCPServer to native MCP (Java)
- [ ] Implement Patient Data MCP Server (Node.js)
- [ ] Implement Lab Results MCP Server (Python)
- [ ] Create MCP client in Node.js for inter-service communication
- [ ] Update webscraper.js to use MCP internally
- [ ] Test all MCP tools with sample queries

**Deliverables:**
- 3 operational MCP servers
- MCP client library
- Documentation for each server

### Phase 2: Knowledge Expansion (Months 3-4)
**Goal:** Build domain-specific MCP servers

- [ ] Implement Medication MCP Server (Python)
- [ ] Implement Clinical Guidelines MCP Server (Python)
- [ ] Implement Clinical Alerts MCP Server (Node.js)
- [ ] Build medication interaction database
- [ ] Curate clinical guidelines database
- [ ] Implement alert routing & notification system

**Deliverables:**
- 5 total MCP servers operational
- Alert system with multi-channel notifications (email, SMS, dashboard)
- Medication interaction database (10k+ drugs)

### Phase 3: Agent Orchestration (Months 5-6)
**Goal:** Enable multi-agent workflows

- [ ] Design agent orchestration service
- [ ] Implement orchestrator using Claude API or local LLM
- [ ] Build agent state management
- [ ] Create sample workflows (glucose, medications, readmission)
- [ ] Implement audit logging for all agent actions
- [ ] Add user consent/override mechanisms

**Deliverables:**
- Orchestration service (Python/JavaScript)
- 3-5 sample workflows
- Agent audit dashboard
- Override/approval UI for clinical team

### Phase 4: Autonomous Monitoring (Months 7-8)
**Goal:** Enable real-time patient monitoring with agent-driven alerts

- [ ] Implement background monitoring service
- [ ] Add periodic patient review triggers
- [ ] Integrate with EHR alert systems
- [ ] Create mobile alert delivery
- [ ] Build alert analytics dashboard
- [ ] Implement feedback loop for ML model improvement

**Deliverables:**
- 24/7 monitoring service
- Mobile-ready alerts
- Analytics dashboard showing alert efficacy
- Model performance tracking

### Phase 5: Integration & Deployment (Months 9-10)
**Goal:** Production deployment and clinical validation

- [ ] Healthcare compliance review (HIPAA, FDA)
- [ ] Clinical validation studies
- [ ] Performance testing (latency, accuracy)
- [ ] Staff training
- [ ] Staged rollout (pilot unit → hospital-wide)
- [ ] 24/7 monitoring & support

**Deliverables:**
- Compliance documentation
- Clinical validation data
- Production deployment plan
- Training materials

---

## 7. Data Flows & API Contracts

### 7.1 Example: Glucose Prediction Request

**Client Request (React UI or Agent):**
```http
POST /api/patients/102/predictions/glucose
Content-Type: application/json

{
  "prediction_type": "glucose_forecast",
  "days_ahead": 7,
  "include_recommendations": true
}
```

**Service Flow:**
```
1. AIPredictions.jsx (or Agent)
   ↓
2. Node.js /api/patients/:id/predictions endpoint
   ├─ Query: Patient data (age, medications, history)
   ├─ Query: Recent glucose readings (Lab MCP)
   ├─ Query: Current medications (Medication MCP)
   ├─ Query: Care pathway (Guidelines MCP)
   ├─ Call: LSTM prediction model
   └─ Call: Recommendation Agent (if requested)
   ↓
3. Research Agent (optional)
   ├─ Search: Latest glucose management research
   └─ Synthesize: Evidence-based recommendations
   ↓
4. Response: Forecast + Recommendations + Reasoning
```

**Response:**
```json
{
  "prediction": {
    "forecast": [150, 165, 170, 185, 190, 195, 200],
    "confidence": 0.87,
    "days": [1, 2, 3, 4, 5, 6, 7]
  },
  "recommendations": [
    {
      "action": "Increase metformin dose",
      "evidence_level": "A",
      "source": "ADA Standards of Care 2024",
      "rationale": "Rising trend despite current dose"
    }
  ],
  "alerts": [
    {
      "type": "urgent",
      "severity": "high",
      "message": "Glucose trend approaching critical range (>250)"
    }
  ]
}
```

### 7.2 MCP Tool Call Format

**Agent Calling Patient Data MCP:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_patient_history",
    "arguments": {
      "patient_id": 102,
      "start_date": "2025-12-06"
    }
  }
}

Response:
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "records": [
      {
        "date": "2025-12-13",
        "glucose": 210,
        "hba1c": 8.5,
        "bmi": 28.2
      }
    ]
  }
}
```

---

## 8. Security & Compliance Considerations

### 8.1 Data Access Control

**Patient Data MCP Server:**
- ✅ Role-based access (clinician, researcher, patient)
- ✅ Audit logging for all tool calls
- ✅ Encryption in transit (TLS 1.3)
- ✅ Encryption at rest (AES-256)
- ⚠️ Token-based authentication (to implement)
- ⚠️ Rate limiting (to implement)

### 8.2 Agent Governance

**Agent Authorization:**
- Only authenticated agents can call tools
- Agent actions must be audited
- Certain recommendations require human approval
- Clinical overrides always possible

**Approval Workflows:**
```
Agent → Proposes Action
    ↓
System → Checks Approval Threshold
    ├─ Low impact (educational) → Execute immediately
    ├─ Medium impact (medication adjustment) → Notify clinician
    └─ High impact (major treatment change) → Require explicit approval
    ↓
Outcome → Logged with decision details
```

### 8.3 Regulatory Compliance

**HIPAA:**
- ✅ Encrypted patient data
- ✅ Access controls
- ⚠️ Audit logging system (to enhance)
- ⚠️ Business Associate Agreements for cloud agents

**FDA Software as Medical Device (SaMD):**
- ⚠️ Clinical validation requirements
- ⚠️ Change management procedures
- ⚠️ Performance monitoring
- ⚠️ Post-market surveillance

**Clinical Liability:**
- ✅ All recommendations backed by evidence
- ⚠️ Clear attribution of recommendations to sources
- ⚠️ Human oversight mechanisms
- ⚠️ Explicit disclaimers on recommendations

---

## 9. Performance & Scalability

### 9.1 Throughput Requirements

| Metric | Current | Target (Year 2) |
|--------|---------|-----------------|
| **Concurrent Users** | 5 | 100+ |
| **Patient Records** | 102 | 10,000+ |
| **Real-time Alerts** | Manual | 1000s/day |
| **Agent Workflows** | 0 | 100s/day |
| **API Requests/sec** | <10 | 100+ |

### 9.2 Latency Targets

| Operation | Current | Target |
|-----------|---------|--------|
| Patient lookup | <100ms | <50ms |
| Lab trend analysis | N/A | <500ms |
| Recommendation generation | N/A | <2s |
| Multi-agent workflow | N/A | <10s |

### 9.3 Infrastructure Scaling

**Database:**
```
Current: SQLite (file-based)
Target: PostgreSQL (cluster)
├─ Primary node (write)
└─ Read replicas (query scaling)
```

**MCP Services:**
```
Current: Single-instance (port-based)
Target: Horizontally scaled microservices
├─ Patient Data Service (3 instances)
├─ Lab Results Service (2 instances)
├─ Medication Service (2 instances)
├─ Guidelines Service (2 instances)
├─ Research Service (3 instances)
└─ Alerts Service (2 instances)
```

**Agent Execution:**
```
Queue-based execution (AsyncIO)
├─ High-priority: Immediate action alerts (<1s)
├─ Normal: Patient reviews (5-10s)
└─ Low-priority: Research synthesis (30-60s)
```

---

## 10. Success Metrics & KPIs

### 10.1 Technical Metrics

- **API Availability:** Target 99.9% uptime
- **Agent Success Rate:** % of workflows completing without errors
- **MCP Call Latency:** P95 <500ms
- **Alert Accuracy:** % of clinically relevant vs. false positives

### 10.2 Clinical Metrics

- **Recommendation Acceptance Rate:** % of agent recommendations implemented
- **Alert Response Time:** Average clinician response time to alerts
- **Readmission Prevention:** % reduction in 30-day readmissions
- **Medication Optimization:** % inappropriate meds identified & corrected

### 10.3 User Engagement

- **Daily Active Users:** Clinicians using system
- **Feature Adoption:** % using agent recommendations
- **User Satisfaction:** Net Promoter Score (NPS)

---

## 11. Risk Mitigation

### 11.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| **API Dependency Failure** | Medium | High | Fallback data, caching, circuit breakers |
| **Agent Hallucination** | Medium | Medium | Evidence-based recommendations only, human review |
| **Performance Degradation** | Low | Medium | Load testing, auto-scaling, monitoring |
| **Data Privacy Breach** | Low | Critical | Encryption, access controls, audit logging |

### 11.2 Clinical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| **Incorrect Recommendation** | Low | Critical | Multi-source evidence, clinical review, disclaimers |
| **Alert Fatigue** | High | High | Smart filtering, severity levels, user customization |
| **Over-reliance on AI** | Medium | High | Explicit disclaimers, human decision loop, monitoring |

---

## 12. Cost Estimation

### 12.1 Development Costs

| Phase | Component | Effort (dev days) | Cost |
|-------|-----------|-------------------|------|
| **1** | MCP servers (3) | 20 | $20K |
| **2** | Knowledge servers (3) | 30 | $30K |
| **3** | Agent orchestration | 25 | $25K |
| **4** | Monitoring & alerts | 20 | $20K |
| **5** | Integration & deployment | 15 | $15K |
| | **Total Development** | **110 days** | **$110K** |

### 12.2 Infrastructure Costs (Annual)

| Component | Cost |
|-----------|------|
| **Cloud VM (3 instances, mid-tier)** | $9,000 |
| **Database (PostgreSQL managed)** | $3,600 |
| **API Calls (PubMed, arXiv, ADA)** | $2,400 |
| **LLM API Costs (agent execution)** | $12,000 |
| **Monitoring & Logging** | $2,400 |
| **Backup & Disaster Recovery** | $2,400 |
| **Support & Maintenance** | $10,000 |
| | **Total Annual** | **$41,800** |

---

## 13. Open Questions & Future Exploration

### 13.1 Architecture Questions

- [ ] Should agents run on local LLMs (privacy) or cloud APIs (capability)?
- [ ] How to handle real-time coordination between agents?
- [ ] What MCP protocol version to target (v1.0 stable or v2.0 preview)?
- [ ] Should we build custom healthcare LLMs or fine-tune existing models?

### 13.2 Clinical Integration Questions

- [ ] How to integrate with existing EHR systems (Epic, Cerner)?
- [ ] What approval workflow for AI recommendations?
- [ ] How to measure clinical impact (RCTs, observational studies)?
- [ ] Who owns liability for AI-generated recommendations?

### 13.3 Regulatory Questions

- [ ] FDA SaMD classification & approval pathway?
- [ ] State medical board requirements for AI in clinical care?
- [ ] International compliance (EU MDR, Canada)?

---

## 14. References & Resources

### 14.1 MCP Protocol
- Model Context Protocol Spec: https://modelcontextprotocol.io/
- Claude MCP Integration: https://claude.ai/docs/mcp

### 14.2 Healthcare Standards
- HL7 FHIR (interoperability): https://www.hl7.org/fhir/
- HIPAA Security Rule: https://www.hhs.gov/hipaa/for-professionals/security/index.html
- FDA Software Validation: https://www.fda.gov/regulatory-information/search-fda-guidance-documents

### 14.3 Clinical Guidelines
- ADA Standards of Care: https://diabetes.org/standards
- AHA/ACC Cardiovascular Guidelines: https://www.acc.org/guidelines
- NHS Evidence: https://www.evidence.nhs.uk/

### 14.4 ML/AI in Healthcare
- Lancet AI in Medicine: https://www.thelancet.com/
- Nature Medicine AI Reviews: https://www.nature.com/articles/collections/ai-medicine
- arXiv ML/Healthcare Papers: https://arxiv.org/list/stat.AP/recent

---

## 15. Appendix: Current Architecture Review

### 15.1 Existing Strengths

✅ **Complete data model** - 102 patients with comprehensive medical histories
✅ **Multi-model ML** - 5 different prediction engines
✅ **Research integration** - PubMed, arXiv, ADA APIs
✅ **Fallback systems** - Graceful degradation, cached data
✅ **Responsive UI** - 7-tab dashboard with real-time updates
✅ **Production-ready** - Deployed on 165.232.54.109

### 15.2 Existing Limitations

⚠️ **REST-only APIs** - Not MCP-native, requires wrappers for agents
⚠️ **Reactive only** - No autonomous monitoring
⚠️ **Single-agent style** - No multi-agent orchestration
⚠️ **Manual alerts** - Clinician-triggered, not system-generated
⚠️ **Hardcoded data** - Some recommendations lack evidence backing
⚠️ **No agent framework** - Required for autonomous workflows

### 15.3 Path to Next Level

The transition from Version 1.0 (current) to Version 2.0 (MCP-native) is systematic:

```
v1.0 (Today)                v2.0 (6-10 months)
─────────────────────────────────────────────────
REST APIs                → MCP Servers (backward compatible)
Static dashboards        → Agent-driven insights
Manual monitoring        → Autonomous monitoring
Single recommendations   → Multi-agent consensus
Web UI only              → Web UI + Agent CLI + API
Research scraping       → Research + synthesis
Hardcoded alerts        → Real-time event-driven alerts
```

---

## 16. Document Maintenance

**Version Control:**
- Commit this document to git for tracking
- Update on major architecture decisions
- Review quarterly for alignment with implementation

**Related Documentation:**
- `/FALLBACK_DATA_FIXES.md` - Web scraping fallback system
- `/README.md` - Project overview
- Code comments in each service for implementation details

**Next Review Date:** March 13, 2026 (Q1 2026)

---

**End of Document**

*For questions or additions, open an issue in the repository.*
