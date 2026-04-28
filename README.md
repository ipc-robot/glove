# Glove Research Project

## Directory Structure

This project follows a strict 4-stage workflow architecture:

1. **`01_data_processing/`**: Data preprocessing pipelines, raw data sets (ignored by git), and Python scripts for metric extraction.
2. **`02_figures_rendering/`**: Independent drawing capsules for each plot/figure in the paper. E.g., `fig1_waffle_structure` contains the lightweight data, specific layout scripts, and the exported PDFs. Shared matplotlib configurations are in `_shared_style`.
3. **`03_manuscript_writing/`**: Core writing materials. Reference PDFs, drafts (`manuv1.md`, etc.), figures, and early-stage ideas.
4. **`04_progress_reports/`**: Documentation of the continuous integration of ideas. Contains LLM log outputs, weekly updates, and presentation slides.

---
*Please adhere to this workflow pipeline to maintain the reproducibility of the figures and scripts.*
