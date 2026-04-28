def calcular_estatisticas(lista):
    """
    Calcula o total, a média, o maior e o menor valor de uma lista de números.
    Retorna uma tupla: (total, media, maior, menor)
    """
    total = sum(lista)
    media = total / len(lista)
    maior = max(lista)
    menor = min(lista)
    return total, media, maior, menor


if __name__ == "__main__":
    numeros = [23, 7, 45, 2, 67, 12, 89, 34, 56, 11]
    total, media, maior, menor = calcular_estatisticas(numeros)
    print("Total:", total)
    print("Média:", media)
    print("Maior:", maior)
    print("Menor:", menor)