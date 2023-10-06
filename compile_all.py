import os
import shutil

def copytree(src: str, dst: str, ignore_files: list = [], ignore_dirs: list = []) -> bool:
    if not os.path.exists(dst):
        os.makedirs(dst)
    for item in os.listdir(src):
        s = os.path.join(src, item)
        d = os.path.join(dst, item)
        if os.path.isdir(s):
            if item not in ignore_dirs:
                shutil.copytree(s, d, ignore=shutil.ignore_patterns(*ignore_files))
        else:
            if item not in ignore_files and not item.endswith('.ts'):
                shutil.copy2(s, d)
    os.system('tsc')

ignore_files = ['.gitignore', 'README.md', 'package-lock.json', 'tsconfig.json', 'compile_all.py']
ignore_dirs = ['node_modules', 'dist', '.git']

copytree('.', 'dist', ignore_files, ignore_dirs)