# Vaxen Frontend - Root Makefile
# This delegates to infra/Makefile for all infrastructure commands

.DEFAULT_GOAL := help

# Delegate all targets to infra/Makefile
%:
	@$(MAKE) -C infra $@

.PHONY: help
help:
	@$(MAKE) -C infra help