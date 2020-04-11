#!/usr/bin/env python3.7
import os
import json
from pathlib import Path


def remove_where(coll, predicate):
    i = 0
    while coll:
        try:
            if predicate(coll[i]):
                del coll[i]
            else:
                i += 1
        except IndexError as e:
            break


def main():
    json_files = list(Path('main').glob('**/*.json'))
    
    # print 'json files:', json_files, '\n'
    FILE_EXTS = ['.png', '.jpg', '.jpeg', '.pdf', '.gif']
    files_in_jsons = []
    
    def handle_dict(dictlike):
        for val in dictlike.values():
            if isinstance(val, unicode):
                if os.path.splitext(val)[1] in FILE_EXTS:
                    dirname = os.path.dirname(js)
                    files_in_jsons.append((dirname, val))
            elif isinstance(val, dict):
                handle_dict(val)
            elif isinstance(val, list):
                handle_list(val)
    
    def handle_list(listlike):
        for val in listlike:
            if isinstance(val, dict):
                handle_dict(val)
    
    for js in json_files:
        with open(js) as f:
            content = json.load(f)
            if isinstance(content, dict):
                handle_dict(content)
            elif isinstance(content, list):
                handle_list(content)
    
    from pprint import pprint
    unused_files = []
    cwd = os.getcwd()
    for dirpath, dirnames, filenames in os.walk(os.getcwd()):
        remove_where(dirnames, lambda d: d.startswith('.'))
        remove_where(filenames, lambda f: not os.path.splitext(f)[1] in FILE_EXTS)
        
        if filenames:
            unused = [f for f in filenames if f not in [_f[1] for _f in files_in_jsons]]
            if unused:
                print "\nUnused files in: ", os.path.relpath(dirpath, cwd)
                pprint(unused)


if __name__ == '__main__':
    main()
