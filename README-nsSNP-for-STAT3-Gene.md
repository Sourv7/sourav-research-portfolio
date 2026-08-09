# nsSNP Analysis of the Human STAT3 Gene — Supplementary Data

Supplementary datasets for an in-silico analysis of nonsynonymous single
nucleotide polymorphisms (nsSNPs) in human *STAT3*.

This repository holds data, not code. It exists so the results of the study
can be inspected, checked, and reused.

## Study

*STAT3* is a transcription factor whose SH2 domain mediates phosphotyrosine
binding, dimerisation, and downstream signalling. Variants in this domain can
alter protein stability, conformational behaviour, and molecular interactions,
and determining how an individual variant changes STAT3 dynamics helps
prioritise which mutations are worth experimental follow-up.

The analysis combines variant collection and annotation, pathogenicity and
stability prediction, conservation scoring, domain mapping, protein-structure
modelling and validation, molecular dynamics simulation, and comparative
conformational analysis across the wild type and six variants: Y640S, G684R,
T663A, L673V, Y672H, and R688W.

A written summary of the methods and findings is available at
[sourav-research-portfolio.vercel.app/project.html?id=stat3-variant-analysis](https://sourav-research-portfolio.vercel.app/project.html?id=stat3-variant-analysis).

## Contents

| File | Contents |
| --- | --- |
| `Supplementary Table 1.xlsx` | All missense variants retrieved from gnomAD: variant ID, chromosome, position, reference and alternate alleles, VEP annotation, rsID, and UniProt mutation ID (~505 variants) |
| `Supplementary Table 2.xlsx` | Pathogenicity and stability predictions for the same variants, one sheet per tool: SIFT, FATHMM, PROVEAN, PolyPhen, SNAP2, PhD-SNP, PON-P2, PMut, Mutation Assessor, I-Mutant 3.0, MUpro, and INPS-MD |
| `Supplementary Table 3.xlsx` | ConSurf conservation scores and conservation status for the shortlisted variants, with the domain each falls in |
| `Supplementary Table 4.xlsx` | Domain mapping: original residue, position, substituted residue, and the consensus domain assignment |
| `Supplementary Table 5.xlsx` | Project HOPE structural summaries describing how each substitution changes residue size, charge, and hydrophobicity |
| `Supplementary Table 6.xlsx` | Model validation for the wild type and each variant: Verify3D score, ERRAT quality factor, and Ramachandran most-favoured, additional-allowed, and combined percentages |
| `Supplementary Table 7.xlsx` | Folding free-energy change (ΔΔG) per variant from mCSM, SDM, DUET, and DynaMut, with the mean and a stabilising or destabilising consensus |
| `Supplementary Table 8.xlsx` | Docking weight scores in kcal/mol for the wild type and variants, reported for centre and lowest-energy representatives |
| `Supplementary Table 9.xlsx` | Post-translational modification predictions by tool and modification type, with local and global residue positions |
| `3) Consurf Score.pdf` | Full ConSurf output: per-residue conservation grade for all 770 residues, with exposed/buried classification and predicted functional and structural sites |
| `5) HOPE Result.docx` | Project HOPE structural effect report for the variants |
| `Supplementary File For Phylogenetic Relationship/` | Sequences and alignments, below |

### Phylogenetic files

| File | Contents |
| --- | --- |
| `STAT3_sequences.fasta` | STAT3 sequences used to build the alignment |
| `STAT3_alignment.fas` | Multiple sequence alignment, FASTA format |
| `STAT3_alignment.mas` | The same alignment in MEGA format |

## Structural validation

Modelled structures reached an average pLDDT of approximately 92.32, with
approximately 91.13% of residues in Ramachandran-favoured regions. Per-model
Verify3D, ERRAT, and Ramachandran figures are in `Supplementary Table 6.xlsx`.

## Pipeline

Variants were retrieved from gnomAD (Table 1), screened through twelve
pathogenicity and stability predictors (Table 2), filtered on conservation
(Table 3, ConSurf PDF) and domain position (Table 4), characterised
structurally with Project HOPE (Table 5), modelled and validated (Table 6),
assessed for folding free-energy change by four independent methods (Table 7),
docked (Table 8), and checked for post-translational modification sites
(Table 9). Sequence alignments supporting the conservation analysis are in the
phylogenetic folder.

## Reuse

These are supplementary research data. If you use them, please cite the
associated study and this repository.

Predictions here are computational. They indicate which variants merit
experimental attention; they are not evidence of pathogenicity on their own,
and they have not been experimentally validated.
