with open('multiplier.json', 'r') as file:
    content = [line for line in file]
    for index, line in enumerate(content):
        if '35.0' in line:
            print(content[index + 1].split()[1])
            print(type(content[index + 1].split()[1]))