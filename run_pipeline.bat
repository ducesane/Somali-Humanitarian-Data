@echo off
title Somalia Humanitarian Data Automated Pipeline
echo ========================================================
echo   SOMALIA HUMANITARIAN DATA AUTOMATED SYNC PIPELINE
echo   Checking UN OCHA HDX CKAN & FTS APIs for New Releases
echo ========================================================
echo.
cd /d "%~dp0"
python automated_pipeline.py --sync
echo.
echo ========================================================
echo   Pipeline finished. Opening status dashboard...
echo ========================================================
start pipeline_status.html
