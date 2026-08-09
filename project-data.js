/**
 * Project case-study data
 * ---------------------------------------------------------------------------
 * Pure data. No DOM access, no rendering. Consumed by:
 *   script.js    to build the homepage project cards
 *   project.js   to build the case-study page
 *
 * Field reference
 *   id               URL slug: project.html?id=<id>
 *   filterCategory   maps to the homepage filter buttons in index.html
 *   visual           canvas structure for the case-study page. One of
 *                    molecule, network, duplex, stack, helix, scatter.
 *   accent           primary or violet. Only these two, because both
 *                    clear 4.5:1 against the page background as text.
 *   category         display categories shown as chips
 *   results          array of either strings or { heading, note, items }
 *   Optional fields (githubUrl, publicationUrl, doi, demoUrl, image) are
 *   omitted entirely when absent, never left as an empty string, so the
 *   renderer can decide not to draw the button at all.
 *
 * PROVENANCE RULE: nothing in this file may state a result that is not
 * traceable to a published paper, a repository, or a manuscript. Where a
 * repository's own results are a software demonstration rather than a
 * biological benchmark, that must be said on the page.
 */

window.PORTFOLIO_PROJECTS = [
    {
        id: "nsclc-drug-discovery",
        image: "og-nsclc-drug-discovery.png",
        // Case-study canvas: compound-target hubs with their satellites.
        visual: "network",
        accent: "primary",
        title:
            "Exploring Nigella sativa Anticancer Properties for " +
            "Non-Small Cell Lung Cancer",
        shortTitle: "AI-Assisted NSCLC Drug Discovery",
        status: "Published Research",
        filterCategory: "bioinformatics",
        category: [
            "Network Pharmacology",
            "Drug Discovery",
            "Molecular Docking",
            "Molecular Dynamics",
            "Bioinformatics"
        ],
        summary:
            "An integrated computational drug-discovery study investigating " +
            "the potential of bioactive compounds from Nigella sativa " +
            "against non-small cell lung cancer using network pharmacology, " +
            "molecular docking, and molecular dynamics simulation.",
        role: "Bioinformatics Researcher and Co-Author",
        problem:
            "Current treatments for non-small cell lung cancer may cause " +
            "serious side effects and substantial financial burden. This " +
            "study investigated whether bioactive compounds from Nigella " +
            "sativa could interact with important NSCLC-associated " +
            "molecular targets and provide candidates for further " +
            "experimental investigation.",
        objectives: [
            "Identify bioactive compounds in Nigella sativa",
            "Predict compound-associated protein targets",
            "Identify NSCLC-associated genes and proteins",
            "Construct compound–target and protein–protein interaction networks",
            "Identify important hub targets",
            "Analyze biological pathways and functional enrichment",
            "Evaluate compound–target binding through molecular docking",
            "Assess complex stability using molecular dynamics simulation"
        ],
        dataset: [
            "19 selected Nigella sativa bioactive compounds",
            "NSCLC-associated genes and proteins",
            "Predicted compound-associated targets",
            "Protein structures for selected core targets",
            "Primary highlighted targets: MAPK3, STAT3, and ALB",
            "Highlighted compounds: catechin, riboflavin, kaempferol, and thymoquinone"
        ],
        methodology: [
            "Compound identification and screening",
            "SwissADME pharmacokinetic evaluation",
            "ProTox-II toxicity prediction",
            "SwissTargetPrediction and STITCH target prediction",
            "STRING protein–protein interaction analysis",
            "Cytoscape network construction and hub analysis",
            "Gene Ontology and KEGG enrichment using ShinyGO",
            "Molecular docking using Schrödinger Glide",
            "Molecular dynamics simulations",
            "RMSD, RMSF, radius of gyration, SASA, and hydrogen-bond analysis"
        ],
        workflow: [
            "Compound identification",
            "ADME and toxicity screening",
            "Target prediction",
            "PPI network analysis",
            "GO/KEGG enrichment",
            "Molecular docking",
            "Molecular dynamics simulation",
            "Candidate prioritization"
        ],
        results: [
            "Nineteen bioactive compounds were included in the final computational analysis",
            "MAPK3, STAT3, and ALB were identified among the important molecular targets",
            "Enrichment analysis connected the selected targets with cancer-related and NSCLC-associated pathways",
            "Molecular docking identified potentially favorable compound–target interactions",
            "Molecular dynamics simulations were used to examine stability of selected protein–ligand complexes",
            "Results provide computational evidence for future biological validation"
        ],
        limitations: [
            "The study is primarily computational",
            "Computational binding predictions do not prove biological efficacy",
            "Selected compounds require experimental toxicity and efficacy testing",
            "Target modulation must be validated using appropriate NSCLC cell models"
        ],
        futureWork: [
            "Cytotoxicity testing using NSCLC cell lines such as A549",
            "Western blot validation of MAPK3 and STAT3 signaling",
            "Apoptosis and cell-death analysis",
            "Experimental target-binding validation",
            "Dose-response and selectivity studies"
        ],
        technologies: [
            "Python", "Cytoscape", "STRING", "ShinyGO", "SwissADME",
            "ProTox-II", "SwissTargetPrediction", "STITCH",
            "Schrödinger Glide", "Molecular dynamics simulation"
        ],
        githubUrl: "https://github.com/Sourv7/Non-Small-Cell--Lung-Cancer",
        publicationUrl:
            "https://www.sciencedirect.com/science/article/pii/S2212429224019564",
        doi: "10.1016/j.fbio.2024.105525",
        citation: {
            title:
                "Exploring Nigella sativa anticancerous properties using " +
                "network pharmacology, molecular docking and molecular " +
                "dynamics simulation approach for non-small cell lung cancer",
            source: "Food Bioscience",
            detail: "Volume 63, Article 105525"
        },
        featured: true
    },

    {
        id: "protein-peptide-multitask",
        image: "og-protein-peptide-multitask.png",
        // Case-study canvas: two sequences with cross-attention links between them.
        visual: "duplex",
        accent: "violet",
        title:
            "Interaction-Aware Multitask Learning for Protein–Peptide " +
            "Binding-Site Prediction",
        shortTitle: "Protein–Peptide Multitask Deep Learning",
        status: "Research and Model Development",
        filterCategory: "protein-ai",
        category: [
            "Deep Learning",
            "Protein Language Models",
            "Protein–Peptide Interaction",
            "Bioinformatics"
        ],
        summary:
            "A deep-learning framework for unified residue-level prediction " +
            "of protein-side and peptide-side binding sites using " +
            "pretrained protein-language-model embeddings and " +
            "interaction-aware feature fusion.",
        role: "AI and Bioinformatics Researcher",
        problem:
            "Accurate protein–peptide binding-site prediction requires " +
            "modeling information from both the protein and the peptide. " +
            "Many existing approaches focus primarily on the protein side " +
            "and do not explicitly learn the relationships between the two " +
            "interacting sequences.",
        objectives: [
            "Predict protein-side binding residues",
            "Predict peptide-side binding residues",
            "Develop a joint interaction-aware prediction framework",
            "Evaluate cross-attention and gated-feature fusion",
            "Compare pretrained protein-language-model embeddings",
            "Test generalization across independent datasets"
        ],
        dataset: [
            "Benchmark sets: TS092, TS125, TS251, TS639",
            "CAMP Test231",
            "TS167 / Test167",
            "LEADS_TS251",
            "Evaluation metrics: MCC, AUROC, AUPRC, precision, recall, F1 score, accuracy"
        ],
        methodology: [
            "Pretrained protein-language-model embeddings",
            "ProtTrans T5-XL-UniRef50 embeddings",
            "ESM-2 embeddings",
            "Bidirectional cross-attention",
            "Gated feature fusion",
            "Multitask residue-level prediction",
            "Independent test-set evaluation",
            "Zero-shot generalization evaluation",
            "Class-imbalance-aware performance evaluation"
        ],
        workflow: [
            "Sequence pair preparation",
            "Protein-language-model embedding",
            "Bidirectional cross-attention",
            "Gated feature fusion",
            "Multitask residue prediction",
            "Independent test evaluation",
            "Zero-shot generalization check"
        ],
        results: [
            {
                heading: "Model development results",
                note:
                    "Figures from ongoing model development, reported per " +
                    "dataset. Values from different datasets are not " +
                    "comparable and are not combined into a single claim.",
                items: [
                    { label: "Protein-side MCC — TS251", value: "≈ 0.677" },
                    { label: "Protein-side AUROC — TS125", value: "≈ 0.925" },
                    { label: "Peptide-side MCC — CAMP Test231", value: "≈ 0.633" },
                    { label: "Zero-shot AUROC — TS167", value: "≈ 0.947" }
                ]
            },
            {
                heading: "Public repository benchmark",
                note:
                    "The public repository ships a deterministic synthetic " +
                    "benchmark so the pipeline can be run offline. Its " +
                    "metrics demonstrate that the software works end to end " +
                    "and are not evidence of biological performance.",
                items: [
                    { label: "Binding classification ROC-AUC (synthetic)", value: "0.9570" },
                    { label: "Binding classification MCC (synthetic)", value: "0.7452" },
                    { label: "Residue-level pocket ROC-AUC (synthetic)", value: "0.9672" },
                    { label: "Residue-level pocket MCC (synthetic)", value: "0.5610" }
                ]
            }
        ],
        limitations: [
            "Performance depends on dataset quality and sequence redundancy control",
            "Peptide-side prediction may be affected by structural flexibility",
            "Some helical peptides may produce overprediction",
            "Experimental structure and binding data remain limited"
        ],
        futureWork: [
            "Structure-aware multimodal learning",
            "ESM-3 integration",
            "Improved peptide-side calibration",
            "Expanded external validation",
            "Web-server or API deployment",
            "Experimental collaboration"
        ],
        technologies: [
            "Python", "PyTorch", "ESM-2", "ProtTrans", "Transformers",
            "Cross-attention", "Multitask learning", "Scikit-learn", "FastAPI"
        ],
        githubUrl: "https://github.com/Sourv7/Protein-Peptide-Multitask-DL",
        featured: true
    },

    {
        id: "ppi-plm-benchmark",
        image: "og-ppi-plm-benchmark.png",
        // Case-study canvas: parallel model layers compared under one protocol.
        visual: "stack",
        accent: "primary",
        // Title follows the repository, which benchmarks protein–PEPTIDE
        // interaction tasks. See the notes in README.md.
        title:
            "Benchmarking Protein Language Models for Protein–Peptide " +
            "Interaction Prediction",
        shortTitle: "PPI-PLM Benchmark",
        status: "Open-Source Research Project",
        filterCategory: "protein-ai",
        category: [
            "Protein Language Models",
            "Protein–Peptide Interaction",
            "Machine Learning",
            "Benchmarking"
        ],
        summary:
            "A modular, reproducible framework for benchmarking pretrained " +
            "protein language models across three connected protein–peptide " +
            "interaction tasks under a shared downstream model and " +
            "evaluation protocol.",
        role: "Machine Learning and Bioinformatics Researcher",
        problem:
            "Comparing protein language models is difficult when each is " +
            "evaluated with a different downstream architecture and " +
            "protocol. Isolating the backbone behind a common interface " +
            "makes the comparison a property of the representation rather " +
            "than of the surrounding code.",
        objectives: [
            "Compare protein-language-model representations",
            "Evaluate interaction-prediction performance",
            "Establish reproducible train/test evaluation",
            "Measure generalization beyond randomly split datasets",
            "Compare multiple classification metrics",
            "Provide an accessible open-source benchmark"
        ],
        dataset: [
            "Pair-level protein–peptide binding classification",
            "Protein residue-level peptide-binding-site prediction",
            "Peptide residue-level protein-binding-site prediction",
            "An offline synthetic example set is included so the pipeline can be run without downloading external data"
        ],
        methodology: [
            "Backbones isolated behind a common residue-embedding interface",
            "Shared downstream model across all backbones",
            "Bidirectional cross-attention with multitask supervision",
            "Adapters for ESM-2, ProtT5-XL-UniRef50, Ankh, ESM3 open, and ESMC",
            "A tiny learned encoder as an offline engineering baseline",
            "Automated tests covering the full pipeline"
        ],
        workflow: [
            "Dataset schema validation",
            "Backbone adapter selection",
            "Residue embedding",
            "Cross-attention downstream model",
            "Multitask training",
            "Evaluation across the three tasks",
            "Figure and report generation"
        ],
        results: [
            {
                heading: "Benchmark status",
                note:
                    "The repository's checked-in figures come from an " +
                    "offline synthetic smoke benchmark that verifies the " +
                    "pipeline runs end to end. The repository states that " +
                    "these are not experimental BioLiP, PepBDB, or Propedia " +
                    "results and must not be presented as biological " +
                    "state-of-the-art performance, so no performance figure " +
                    "is reproduced here.",
                items: [
                    "Complete benchmark results and methodological documentation are available in the associated repository."
                ]
            }
        ],
        limitations: [
            "Checked-in results verify software correctness, not biological performance",
            "Foundation-model checkpoints are governed by their own licenses and access terms",
            "Meaningful comparison requires a similarity-controlled dataset and GPU resources"
        ],
        futureWork: [
            "Evaluation on similarity-controlled experimental datasets",
            "Extending the backbone matrix as new models are released",
            "Published comparison across backbones under the shared protocol"
        ],
        technologies: [
            "Python", "PyTorch", "Hugging Face Transformers", "ESM-2",
            "ProtT5-XL-UniRef50", "Ankh", "Cross-attention",
            "Multitask learning"
        ],
        githubUrl: "https://github.com/Sourv7/PPI-PLM-Benchmark",
        featured: true
    },

    {
        id: "stat3-variant-analysis",
        image: "og-stat3-variant-analysis.png",
        // Case-study canvas: an alpha helix with marked residue positions.
        visual: "helix",
        accent: "violet",
        title:
            "Structural and Dynamic Analysis of Functional STAT3 " +
            "SH2-Domain Variants",
        shortTitle: "STAT3 nsSNP Analysis",
        status: "Computational Research",
        filterCategory: "bioinformatics",
        category: [
            "Structural Bioinformatics",
            "Molecular Dynamics",
            "Variant Analysis",
            "Cancer Biology"
        ],
        summary:
            "A computational investigation of disease-associated STAT3 " +
            "SH2-domain variants combining pathogenicity prediction, " +
            "structural modeling, molecular dynamics simulation, and " +
            "comparative conformational analysis.",
        role: "Computational Biology Researcher",
        problem:
            "Variants in the STAT3 SH2 domain can modify protein " +
            "stability, conformational behavior, and molecular " +
            "interactions. Determining how individual variants influence " +
            "STAT3 dynamics can help prioritize functionally important " +
            "mutations.",
        objectives: [
            "Collect and annotate disease-associated SH2-domain variants",
            "Predict pathogenicity and stability effects",
            "Model and validate variant structures",
            "Simulate wild-type and variant dynamics",
            "Compare conformational sampling across variants"
        ],
        dataset: [
            "Wild type and six variants: Y640S, G684R, T663A, L673V, Y672H, R688W",
            "Gain-of-function group: Y640S and G684R",
            "Strongly destabilizing group: T663A and L673V",
            "Intermediate behavior: Y672H and R688W",
            "Structural validation: average pLDDT ≈ 92.32; Ramachandran favored ≈ 91.13%"
        ],
        methodology: [
            "Variant collection and annotation",
            "Pathogenicity and stability prediction",
            "Protein-structure modeling",
            "Structural validation",
            "Molecular dynamics simulation",
            "RMSD analysis",
            "RMSF analysis",
            "Radius of gyration analysis",
            "SASA analysis",
            "Principal-component analysis",
            "Comparative conformational analysis"
        ],
        workflow: [
            "Variant collection",
            "Pathogenicity prediction",
            "Structure modeling",
            "Structure validation",
            "Molecular dynamics simulation",
            "Trajectory analysis",
            "Principal-component analysis",
            "Comparative interpretation"
        ],
        results: [
            {
                heading: "Conformational sampling (PCA area)",
                note:
                    "PCA area summarizes the breadth of conformational " +
                    "space sampled along the first two principal " +
                    "components. A larger area means broader sampling in " +
                    "this simulation; it is not on its own evidence of " +
                    "pathogenicity.",
                items: [
                    { label: "Wild type", value: "0.468" },
                    { label: "Y640S", value: "0.360" },
                    { label: "G684R", value: "0.415" },
                    { label: "T663A", value: "4.139" },
                    { label: "L673V", value: "4.319" },
                    { label: "Y672H", value: "1.236" },
                    { label: "R688W", value: "1.004" }
                ]
            },
            {
                heading: "Interpretation",
                items: [
                    "T663A and L673V occupied substantially broader conformational space than the wild type",
                    "Y640S and G684R remained comparatively compact relative to the wild type",
                    "Y672H and R688W showed intermediate behavior",
                    "Modeled structures passed validation with an average pLDDT of approximately 92.32 and approximately 91.13% Ramachandran-favored residues"
                ]
            }
        ],
        limitations: [
            "Computational predictions require experimental validation",
            "Simulation outcomes depend on force field and sampling duration",
            "Variant behavior in an isolated modeled system may differ from the cellular environment",
            "Functional signaling consequences require biological testing"
        ],
        futureWork: [
            "Experimental expression and stability studies",
            "STAT3 phosphorylation assays",
            "DNA-binding and dimerization analysis",
            "Cell-based functional validation",
            "Ligand or inhibitor response studies"
        ],
        technologies: [
            "Molecular dynamics simulation", "Principal-component analysis",
            "Protein-structure modeling", "Structure validation",
            "Pathogenicity prediction", "Python"
        ],
        githubUrl: "https://github.com/Sourv7/nsSNP-for-STAT3-Gene",
        featured: true
    },

    {
        id: "breast-cancer-ml",
        image: "og-breast-cancer-ml.png",
        // Case-study canvas: two separable clusters.
        visual: "scatter",
        accent: "primary",
        title: "Interpretable Machine Learning for Breast Cancer Classification",
        shortTitle: "Interpretable Breast Cancer ML",
        status: "Open-Source Machine Learning Project",
        filterCategory: "machine-learning",
        category: [
            "Machine Learning",
            "Explainable AI",
            "Cancer Classification",
            "Biomedical Data Science"
        ],
        summary:
            "A biomedical machine-learning project focused on accurate " +
            "breast-cancer classification with interpretable predictions " +
            "and transparent feature-level analysis.",
        role: "Machine Learning Researcher",
        problem:
            "A classifier used in a biomedical setting has to be more than " +
            "accurate: the basis for each prediction needs to be " +
            "inspectable, and the evaluation has to avoid the leakage that " +
            "makes reported accuracy meaningless.",
        objectives: [
            "Classify tumors as malignant or benign from quantitative image features",
            "Keep preprocessing leakage-safe",
            "Compare several classifiers under one protocol",
            "Select a model without touching the test set",
            "Explain predictions through global feature importance"
        ],
        dataset: [
            "Breast Cancer Wisconsin Diagnostic dataset, loaded programmatically from scikit-learn",
            "569 samples",
            "30 input features",
            "Two classes: malignant and benign",
            "No missing values in the original dataset"
        ],
        methodology: [
            "Reproducible data preparation",
            "Leakage-safe preprocessing with scikit-learn pipelines",
            "Stratified train/test splitting",
            "Comparison of logistic regression, random forest, and an RBF-kernel support vector machine",
            "Model selection by mean stratified 5-fold cross-validation ROC-AUC on the training set only",
            "A single final evaluation on the untouched test set",
            "Global feature-importance analysis",
            "Model persistence and automated tests"
        ],
        workflow: [
            "Data preparation",
            "Leakage-safe preprocessing",
            "Stratified splitting",
            "Cross-validated model comparison",
            "Model selection",
            "Single test-set evaluation",
            "Feature-importance analysis"
        ],
        results: [
            {
                heading: "Model selection",
                items: [
                    "Five-fold training-set cross-validation selected logistic regression, with a mean ROC-AUC of 0.9954"
                ]
            },
            {
                heading: "Held-out test set",
                note:
                    "The test set was evaluated once, after model selection " +
                    "was complete.",
                items: [
                    { label: "ROC-AUC", value: "0.9954" },
                    { label: "PR-AUC", value: "0.9931" },
                    { label: "Accuracy", value: "0.9737" },
                    { label: "Balanced accuracy", value: "0.9692" },
                    { label: "Precision", value: "0.9756" },
                    { label: "Sensitivity / recall", value: "0.9524" },
                    { label: "Specificity", value: "0.9861" },
                    { label: "F1 score", value: "0.9639" },
                    { label: "Matthews correlation coefficient", value: "0.9433" }
                ]
            }
        ],
        limitations: [
            "The dataset is a single, well-studied benchmark and is not representative of clinical practice",
            "Features are derived from digitized fine-needle aspirate images, not raw imaging",
            "High benchmark accuracy does not transfer to a clinical setting without prospective validation",
            "Global feature importance explains the model, not the underlying biology"
        ],
        futureWork: [
            "Validation on an independent external cohort",
            "Per-prediction local explanations alongside global importance",
            "Calibration analysis for probability outputs",
            "Decision-threshold analysis driven by clinical cost"
        ],
        technologies: [
            "Python", "scikit-learn", "Pandas", "NumPy", "Matplotlib",
            "Cross-validation", "Explainable AI"
        ],
        githubUrl: "https://github.com/Sourv7/Interpretable-Breast-Cancer-ML",
        featured: true
    }
];
