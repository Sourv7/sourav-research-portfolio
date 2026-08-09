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
| `Supplementary Table 1.xlsx` | *Add a one-line description* |
| `Supplementary Table 2.xlsx` | *Add a one-line description* |
| `Supplementary Table 3.xlsx` | *Add a one-line description* |
| `Supplementary Table 4.xlsx` | *Add a one-line description* |
| `Supplementary Table 5.xlsx` | *Add a one-line description* |
| `Supplementary Table 6.xlsx` | *Add a one-line description* |
| `Supplementary Table 7.xlsx` | *Add a one-line description* |
| `Supplementary Table 8.xlsx` | *Add a one-line description* |
| `Supplementary Table 9.xlsx` | *Add a one-line description* |
| `3) Consurf Score.pdf` | ConSurf evolutionary conservation scores per residue |
| `5) HOPE Result.docx` | Project HOPE structural effect report for the variants |
| `Supplementary File For Phylogenetic Relationship/` | Sequences and alignments, below |

### Phylogenetic files

| File | Contents |
| --- | --- |
| `STAT3_sequences.fasta` | STAT3 sequences used to build the alignment |
| `STAT3_alignment.fas` | Multiple sequence alignment, FASTA format |
| `STAT3_alignment.mas` | The same alignment in MEGA format |

> The nine supplementary tables are the only files whose contents are not
> evident from the filename. One line each is enough — what the table holds
> and which tool produced it. Anyone evaluating this work will read this table
> before opening a single spreadsheet.

## Structural validation

Modelled structures reached an average pLDDT of approximately 92.32, with
approximately 91.13% of residues in Ramachandran-favoured regions.

## Reuse

These are supplementary research data. If you use them, please cite the
associated study and this repository.

Predictions here are computational. They indicate which variants merit
experimental attention; they are not evidence of pathogenicity on their own,
and they have not been experimentally validated.
