# Nigella sativa and Non-Small Cell Lung Cancer — Supplementary Data

Supplementary datasets for a network pharmacology, molecular docking, and
molecular dynamics study of *Nigella sativa* bioactive compounds against
non-small cell lung cancer (NSCLC).

This repository holds data, not code. It exists so the results of the study
can be inspected, checked, and reused.

## Publication

**Exploring Nigella sativa anticancerous properties using network pharmacology,
molecular docking and molecular dynamics simulation approach for non-small cell
lung cancer**

*Food Bioscience*, Volume 63, Article 105525
DOI: [10.1016/j.fbio.2024.105525](https://doi.org/10.1016/j.fbio.2024.105525)
[Read on ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2212429224019564)

A written summary of the methods and findings is available at
[sourav-research-portfolio.vercel.app/project.html?id=nsclc-drug-discovery](https://sourav-research-portfolio.vercel.app/project.html?id=nsclc-drug-discovery).

## Study

Current treatments for NSCLC can carry serious side effects and a substantial
financial burden. This study asked whether bioactive compounds from *Nigella
sativa* interact with molecular targets associated with NSCLC, and whether any
are worth experimental follow-up.

Nineteen bioactive compounds were screened for pharmacokinetic and toxicity
properties, their protein targets predicted and intersected with
NSCLC-associated genes, the resulting network analysed for hub targets, and
the strongest compound–target pairs examined by docking and molecular dynamics
simulation. MAPK3, STAT3, and ALB were among the important targets identified.

## Contents

Files follow the S1–S11 numbering used in the paper.

| File | Contents |
| --- | --- |
| `S1 (target information of ingredients and disease).xlsx` | Predicted targets of the *Nigella sativa* compounds |
| `S2 (Disease target information).xlsx` | NSCLC-associated genes and proteins |
| `S3 (Common genes of compounds and disease).xlsx` | Intersection of compound targets and disease targets |
| `S4 (Go Enrichment analysis).xlsx` | Full Gene Ontology enrichment results |
| `S5 (Information of 10 selected GO).xlsx` | The ten GO terms carried into the analysis |
| `S6 (KEGG Enrichment Analysis).xlsx` | Full KEGG pathway enrichment results |
| `S7 (Information of 10 selected KEGG pathways).xlsx` | The ten KEGG pathways carried forward |
| `S8 (Grid dimensions).xlsx` | Docking grid box dimensions per target |
| `S9 (Binding score of protien and ligand).xlsx` | Docking scores for each protein–ligand pair |
| `S10 (Binding of Genes with positive control).xlsx` | Positive-control binding results |
| `S11 (Binding of Genes with α-hederin, nigellicine, thymohydroquinone, thymol, negillidine).xlsx` | Binding results for five named compounds |

## Methods and tools

Compound screening and pharmacokinetics with SwissADME; toxicity prediction
with ProTox-II; target prediction with SwissTargetPrediction and STITCH;
protein–protein interaction analysis with STRING; network construction and hub
analysis in Cytoscape; Gene Ontology and KEGG enrichment with ShinyGO;
molecular docking with Schrödinger Glide; molecular dynamics simulation with
RMSD, RMSF, radius of gyration, SASA, and hydrogen-bond analysis.

## Reuse

If you use these data, please cite the *Food Bioscience* paper above.

The study is computational. Docking scores and simulation stability indicate
which compound–target pairs merit laboratory work; they do not demonstrate
biological efficacy. Cytotoxicity, target engagement, and selectivity all
remain to be tested experimentally.
