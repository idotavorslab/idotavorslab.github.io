import os


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
    for dirpath, dirnames, filenames in os.walk(os.getcwd()):
        remove_where(dirnames, lambda d: d.startswith('.'))
        remove_where(filenames, lambda f: not f.endswith('.json')
                                          or os.path.basename(dirpath) != os.path.splitext(os.path.basename(f))[0])

        if filenames:
            print('dirpath:', dirpath, 'dirnames:', dirnames, 'filenames:', filenames)


if __name__ == '__main__':
    main()
