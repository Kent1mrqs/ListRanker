# Algo

## pick_unique_sequence_duel_candidates

Avec $N$ le nombre d'éléments dans la liste, $S$ le score, $i$ la position 1, $j$ la position 2, $C_i$ le nombre
d'élément avant le rang $i$, $\Delta j$ le nombre d'élément dans le rang $i$ jusqu'à $j$.

i=\frac{(2N−1−\sqrt{4N(N−1)+1−8S)}}2

C_i=\frac{i(2N−i−1)}{2}

\Delta j=S-C_i

j=i+1-\Delta j
