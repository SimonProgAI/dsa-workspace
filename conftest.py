"""Puts harness/python on sys.path so `pytest` can import dsatest with no setup.

pytest loads the conftest.py at the workspace root automatically, which is why
running `pytest` from anywhere in the workspace just works. Nothing else in the
workspace depends on this file.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "harness" / "python"))
