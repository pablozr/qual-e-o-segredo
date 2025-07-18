// Configurações do jogo
const NUMEROS_TOTAL = 36; // Alterado para 36 (6x6 como nos tabuleiros do PDF)
const COLUNAS = 6; // Alterado para 6 colunas
const ROUNDS = 7; // 7 pistas fixas

// Conjunto fixo de 7 regras base (o valor isTrue será definido por tabuleiro)
const FIXED_RULES_BASE = [
    {
        texto: "O número não é múltiplo de 4",
        check: n => n % 4 !== 0
    },
    {
        texto: "O número não é divisível por 5",
        check: n => n % 5 !== 0
    },
    {
        texto: "O número não é par",
        check: n => n % 2 !== 0
    },
    {
        texto: "O número é múltiplo de 3",
        check: n => n % 3 === 0
    },
    {
        texto: "O número não é divisível por 9",
        check: n => n % 9 !== 0
    },
    {
        texto: "O resto da divisão por 5 é 2",
        check: n => n % 5 === 2
    },
    {
        texto: "A soma dos algarismos é ímpar",
        check: n => sumDigits(n) % 2 === 1
    }
];

// Tabuleiros do PDF - Todos os 91 tabuleiros
const TABULEIROS_PDF = [
    {
        id: 1,
        numeros: [729, 662, 807, 979, 890, 246, 933, 491, 88, 327, 846, 271, 157, 698, 375, 617, 367, 546, 847, 695, 794, 870, 880, 163, 201, 124, 125, 906, 407, 424, 380, 447, 144, 408, 665, 404],
        candidatos: [447, 807],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 10"
        ],
        segredo: 447,
    },
    {
        id: 2,
        numeros: [659, 94, 42, 30, 583, 267, 236, 799, 522, 376, 541, 402, 255, 867, 99, 476, 16, 850, 571, 713, 645, 474, 892, 765, 876, 507, 768, 780, 953, 606, 123, 939, 210, 121, 977, 842],
        candidatos: [267, 867],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 1"
        ],
        segredo: 267,

    },
    {
        id: 3,
        numeros: [838, 249, 904, 254, 589, 700, 950, 628, 825, 277, 708, 120, 237, 962, 878, 130, 50, 82, 481, 418, 703, 569, 169, 480, 642, 807, 79, 928, 663, 267, 241, 253, 495, 250, 148, 783],
        candidatos: [267, 807],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 9"
        ],
        segredo: 807,

    },
    {
        id: 4,
        numeros: [504, 524, 364, 652, 360, 336, 748, 152, 325, 310, 985, 255, 90, 850, 586, 422, 866, 914, 378, 626, 82, 779, 131, 1, 907, 713, 467, 869, 683, 887, 819, 651, 741, 237, 177, 357],
        candidatos: [177, 357],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 6"
        ],
        segredo: 177,

    },
    {
        id: 5,
        numeros: [195, 117, 602, 74, 643, 512, 366, 449, 811, 267, 633, 494, 926, 430, 215, 960, 913, 425, 244, 164, 349, 820, 453, 806, 30, 490, 296, 502, 283, 128, 77, 472, 113, 701, 717, 57],
        candidatos: [267, 717],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 14"
        ],
        segredo: 717,

    },
    {
        id: 6,
        numeros: [690, 427, 489, 484, 173, 552, 547, 395, 306, 537, 706, 327, 181, 50, 658, 793, 751, 982, 972, 18, 735, 455, 104, 176, 558, 583, 207, 810, 202, 220, 597, 988, 631, 7, 172, 849],
        candidatos: [537, 597],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 5"
        ],
        segredo: 537,

    },
    {
        id: 7,
        numeros: [498, 729, 661, 716, 515, 61, 59, 258, 123, 842, 290, 532, 672, 765, 897, 224, 231, 617, 267, 198, 830, 702, 461, 976, 870, 965, 354, 767, 587, 580, 989, 986, 227, 687, 448, 160],
        candidatos: [267, 687],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 3"
        ],
        segredo: 687,

    },
    {
        id: 8,
        numeros: [417, 822, 178, 662, 247, 996, 537, 242, 933, 827, 579, 881, 878, 470, 550, 691, 616, 319, 708, 754, 531, 970, 280, 65, 15, 357, 944, 92, 620, 977, 294, 43, 107, 569, 352, 835],
        candidatos: [357, 537],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 15"
        ],
        segredo: 357,

    },
    {
        id: 9,
        numeros: [712, 714, 175, 368, 980, 863, 332, 285, 281, 145, 984, 778, 963, 342, 696, 807, 563, 578, 787, 798, 601, 560, 357, 723, 998, 301, 947, 910, 520, 451, 471, 895, 825, 91, 987, 682],
        candidatos: [357, 807],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 9"
        ],
        segredo: 807,
    },
    {
        id: 10,
        numeros: [941, 321, 880, 784, 350, 4, 226, 733, 57, 718, 475, 445, 997, 536, 856, 267, 704, 909, 462, 663, 186, 341, 134, 613, 828, 790, 902, 899, 83, 727, 894, 165, 653, 284, 125, 87],
        candidatos: [87, 267],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 1"
        ],
        segredo: 267,

    },
    {
        id: 11,
        numeros: [843, 135, 859, 151, 514, 541, 315, 510, 840, 140, 764, 263, 211, 450, 213, 886, 990, 468, 898, 627, 171, 836, 938, 222, 482, 760, 763, 452, 87, 479, 929, 670, 566, 697, 252, 507],
        candidatos: [87, 627],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 0"
        ],
        segredo: 627,
    },
    {
        id: 12,
        numeros: [493, 698, 433, 939, 373, 402, 64, 240, 464, 804, 286, 782, 717, 715, 667, 788, 159, 10, 418, 174, 397, 783, 375, 632, 144, 241, 335, 885, 287, 605, 237, 49, 807, 654, 316, 553],
        candidatos: [717, 807],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 14"
        ],
        segredo: 717,
        pistasVerdadeiras: [true, true, true, true, true, true, true]
    },
    {
        id: 13,
        numeros: [454, 594, 177, 513, 292, 509, 805, 867, 79, 759, 647, 170, 571, 24, 987, 97, 334, 786, 330, 312, 398, 372, 215, 126, 875, 930, 669, 936, 596, 428, 407, 534, 871, 212, 293, 137],
        candidatos: [177, 867],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 6"
        ],
        segredo: 177,
        pistasVerdadeiras: [true, true, true, true, true, true, true]
    },
    {
        id: 14,
        numeros: [154, 629, 503, 743, 136, 900, 959, 832, 157, 21, 624, 924, 882, 957, 429, 327, 890, 345, 300, 618, 937, 29, 895, 506, 6, 990, 430, 80, 814, 570, 736, 839, 867, 379, 966, 243],
        candidatos: [867, 957],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 6"
        ],
        segredo: 957,
        pistasVerdadeiras: [true, true, true, true, true, true, true]
    },
    {
        id: 15,
        numeros: [219, 598, 664, 413, 44, 874, 396, 166, 28, 323, 792, 149, 344, 807, 303, 515, 762, 251, 703, 20, 645, 919, 78, 259, 925, 395, 538, 943, 621, 87, 394, 510, 675, 897, 143, 208],
        candidatos: [87, 807],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 11"
        ],
        segredo: 87
    },
    {
        id: 16,
        numeros: [475, 355, 609, 282, 527, 742, 261, 582, 108, 533, 440, 356, 496, 425, 916, 447, 634, 314, 876, 87, 967, 307, 679, 903, 630, 775, 640, 622, 120, 934, 655, 119, 857, 417, 551, 607],
        candidatos: [87, 447],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 10"
        ],
        segredo: 447
    },
    {
        id: 17,
        numeros: [169, 147, 574, 245, 872, 191, 841, 114, 557, 115, 432, 851, 192, 194, 339, 710, 163, 361, 686, 962, 146, 516, 584, 715, 612, 411, 31, 118, 537, 420, 447, 269, 690, 835, 200, 441],
        candidatos: [447, 537],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 5"
        ],
        segredo: 537
    },
    {
        id: 18,
        numeros: [46, 799, 11, 544, 492, 195, 589, 130, 821, 608, 908, 818, 353, 543, 295, 864, 463, 605, 922, 777, 537, 322, 638, 329, 426, 105, 749, 927, 739, 465, 592, 147, 238, 204, 808, 681],
        candidatos: [537, 777],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 17"
        ],
        segredo: 777
    },
    {
        id: 19,
        numeros: [16, 13, 168, 266, 127, 623, 897, 474, 867, 659, 199, 735, 377, 744, 680, 488, 309, 399, 175, 103, 246, 950, 158, 26, 165, 369, 537, 722, 456, 923, 826, 670, 685, 17, 724, 548],
        candidatos: [537, 867],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 12"
        ],
        segredo: 867
    },
    {
        id: 20,
        numeros: [540, 62, 521, 93, 829, 507, 23, 101, 476, 879, 791, 162, 526, 182, 590, 218, 597, 833, 785, 387, 380, 58, 830, 572, 568, 254, 852, 403, 581, 404, 310, 776, 87, 995, 885, 457],
        candidatos: [87, 597],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 8"
        ],
        segredo: 597
    },
    {
        id: 21,
        numeros: [738, 979, 861, 948, 340, 646, 637, 545, 954, 562, 816, 987, 99, 400, 823, 619, 248, 89, 234, 721, 957, 90, 994, 777, 19, 110, 265, 32, 15, 904, 973, 774, 591, 912, 250, 337],
        candidatos: [777, 957],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 7"
        ],
        segredo: 957
    },
    {
        id: 22,
        numeros: [299, 495, 116, 497, 214, 348, 487, 419, 673, 447, 262, 458, 684, 870, 414, 139, 951, 896, 385, 183, 726, 666, 167, 415, 730, 417, 317, 940, 687, 434, 648, 70, 421, 693, 888, 76],
        candidatos: [447, 687],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 3"
        ],
        segredo: 687
    },
    {
        id: 23,
        numeros: [732, 124, 877, 112, 87, 275, 953, 289, 406, 86, 210, 906, 771, 438, 2, 796, 678, 205, 809, 949, 111, 725, 442, 50, 671, 184, 505, 276, 264, 931, 641, 40, 711, 57, 311, 867],
        candidatos: [87, 867],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 12"
        ],
        segredo: 867
    },
    {
        id: 24,
        numeros: [561, 826, 855, 556, 486, 383, 499, 290, 831, 998, 306, 615, 285, 96, 155, 308, 786, 203, 439, 874, 416, 781, 209, 36, 627, 734, 537, 803, 610, 237, 911, 180, 636, 884, 351, 47],
        candidatos: [537, 627],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 12"
        ],
        segredo: 537
    },
    {
        id: 25,
        numeros: [188, 239, 762, 717, 232, 350, 33, 327, 802, 260, 114, 945, 8, 810, 474, 993, 87, 889, 956, 109, 371, 983, 768, 322, 917, 559, 506, 54, 27, 935, 389, 450, 392, 745, 644, 883],
        candidatos: [87, 717],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 11"
        ],
        segredo: 87
    },
    {
        id: 26,
        numeros: [564, 800, 10, 833, 687, 331, 9, 324, 719, 196, 695, 313, 236, 147, 600, 794, 772, 242, 825, 270, 718, 562, 769, 179, 98, 193, 228, 790, 462, 763, 367, 982, 87, 969, 921, 405],
        candidatos: [87, 687],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 3"
        ],
        segredo: 687
    },
    {
        id: 27,
        numeros: [257, 756, 697, 700, 676, 741, 177, 313, 750, 68, 61, 282, 444, 238, 74, 650, 145, 258, 125, 893, 461, 267, 892, 57, 901, 376, 255, 518, 674, 149, 363, 955, 571, 48, 459, 962],
        candidatos: [177, 267],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 1"
        ],
        segredo: 267
    },
    {
        id: 28,
        numeros: [765, 326, 307, 463, 331, 965, 819, 653, 100, 304, 201, 490, 256, 84, 178, 507, 720, 151, 731, 923, 986, 781, 550, 795, 216, 384, 480, 586, 166, 150, 249, 394, 627, 182, 177, 791],
        candidatos: [177, 627],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 0"
        ],
        segredo: 627
    },
    {
        id: 29,
        numeros: [504, 524, 364, 652, 360, 336, 748, 152, 325, 310, 985, 255, 90, 850, 586, 422, 866, 914, 378, 626, 82, 779, 131, 1, 907, 713, 467, 869, 683, 887, 819, 651, 741, 237, 177, 357],
        candidatos: [177, 357],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 6"
        ],
        segredo: 177
    },
    {
        id: 30,
        numeros: [195, 117, 602, 74, 643, 512, 366, 449, 811, 267, 633, 494, 926, 430, 215, 960, 913, 425, 244, 164, 349, 820, 453, 806, 30, 490, 296, 502, 283, 128, 77, 472, 113, 701, 717, 57],
        candidatos: [267, 717],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 14"
        ],
        segredo: 717
    },
    {
        id: 31,
        numeros: [690, 427, 489, 484, 173, 552, 547, 395, 306, 537, 706, 327, 181, 50, 658, 793, 751, 982, 972, 18, 735, 455, 104, 176, 558, 583, 207, 810, 202, 220, 597, 988, 631, 7, 172, 849],
        candidatos: [537, 597],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 5"
        ],
        segredo: 537
    },
    {
        id: 32,
        numeros: [498, 729, 661, 716, 515, 61, 59, 258, 123, 842, 290, 532, 672, 765, 897, 224, 231, 617, 267, 198, 830, 702, 461, 976, 870, 965, 354, 767, 587, 580, 989, 986, 227, 687, 448, 160],
        candidatos: [267, 687],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 3"
        ],
        segredo: 687
    },
    {
        id: 33,
        numeros: [417, 822, 178, 662, 247, 996, 537, 242, 933, 827, 579, 881, 878, 470, 550, 691, 616, 319, 708, 754, 531, 970, 280, 65, 15, 357, 944, 92, 620, 977, 294, 43, 107, 569, 352, 835],
        candidatos: [357, 537],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 15"
        ],
        segredo: 357
    },
    {
        id: 34,
        numeros: [712, 714, 175, 368, 980, 863, 332, 285, 281, 145, 984, 778, 963, 342, 696, 807, 563, 578, 787, 798, 601, 560, 357, 723, 998, 301, 947, 910, 520, 451, 471, 895, 825, 91, 987, 682],
        candidatos: [357, 807],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 9"
        ],
        segredo: 807
    },
    {
        id: 35,
        numeros: [941, 321, 880, 784, 350, 4, 226, 733, 57, 718, 475, 445, 997, 536, 856, 267, 704, 909, 462, 663, 186, 341, 134, 613, 828, 790, 902, 899, 83, 727, 894, 165, 653, 284, 125, 87],
        candidatos: [87, 267],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 1"
        ],
        segredo: 267
    },
    {
        id: 36,
        numeros: [843, 135, 859, 151, 514, 541, 315, 510, 840, 140, 764, 263, 211, 450, 213, 886, 990, 468, 898, 627, 171, 836, 938, 222, 482, 760, 763, 452, 87, 479, 929, 670, 566, 697, 252, 507],
        candidatos: [87, 627],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 0"
        ],
        segredo: 627
    },
    {
        id: 37,
        numeros: [493, 698, 433, 939, 373, 402, 64, 240, 464, 804, 286, 782, 717, 715, 667, 788, 159, 10, 418, 174, 397, 783, 375, 632, 144, 241, 335, 885, 287, 605, 237, 49, 807, 654, 316, 553],
        candidatos: [717, 807],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 14"
        ],
        segredo: 717
    },
    {
        id: 38,
        numeros: [454, 594, 177, 513, 292, 509, 805, 867, 79, 759, 647, 170, 571, 24, 987, 97, 334, 786, 330, 312, 398, 372, 215, 126, 875, 930, 669, 936, 596, 428, 407, 534, 871, 212, 293, 137],
        candidatos: [177, 867],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 6"
        ],
        segredo: 177
    },
    {
        id: 39,
        numeros: [154, 629, 503, 743, 136, 900, 959, 832, 157, 21, 624, 924, 882, 957, 429, 327, 890, 345, 300, 618, 937, 29, 895, 506, 6, 990, 430, 80, 814, 570, 736, 839, 867, 379, 966, 243],
        candidatos: [867, 957],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 6"
        ],
        segredo: 957
    },
    {
        id: 40,
        numeros: [219, 598, 664, 413, 44, 874, 396, 166, 28, 323, 792, 149, 344, 807, 303, 515, 762, 251, 703, 20, 645, 919, 78, 259, 925, 395, 538, 943, 621, 87, 394, 510, 675, 897, 143, 208],
        candidatos: [87, 807],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 11"
        ],
        segredo: 87
    },
    {
        id: 41,
        numeros: [475, 355, 609, 282, 527, 742, 261, 582, 108, 533, 440, 356, 496, 425, 916, 447, 634, 314, 876, 87, 967, 307, 679, 903, 630, 775, 640, 622, 120, 934, 655, 119, 857, 417, 551, 607],
        candidatos: [87, 447],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 10"
        ],
        segredo: 447
    },
    {
        id: 42,
        numeros: [169, 147, 574, 245, 872, 191, 841, 114, 557, 115, 432, 851, 192, 194, 339, 710, 163, 361, 686, 962, 146, 516, 584, 715, 612, 411, 31, 118, 537, 420, 447, 269, 690, 835, 200, 441],
        candidatos: [447, 537],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 5"
        ],
        segredo: 537
    },
    {
        id: 43,
        numeros: [46, 799, 11, 544, 492, 195, 589, 130, 821, 608, 908, 818, 353, 543, 295, 864, 463, 605, 922, 777, 537, 322, 638, 329, 426, 105, 749, 927, 739, 465, 592, 147, 238, 204, 808, 681],
        candidatos: [537, 777],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 17"
        ],
        segredo: 777
    },
    {
        id: 44,
        numeros: [16, 13, 168, 266, 127, 623, 897, 474, 867, 659, 199, 735, 377, 744, 680, 488, 309, 399, 175, 103, 246, 950, 158, 26, 165, 369, 537, 722, 456, 923, 826, 670, 685, 17, 724, 548],
        candidatos: [537, 867],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 12"
        ],
        segredo: 867
    },
    {
        id: 45,
        numeros: [540, 62, 521, 93, 829, 507, 23, 101, 476, 879, 791, 162, 526, 182, 590, 218, 597, 833, 785, 387, 380, 58, 830, 572, 568, 254, 852, 403, 581, 404, 310, 776, 87, 995, 885, 457],
        candidatos: [87, 597],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 8"
        ],
        segredo: 597
    },
    {
        id: 46,
        numeros: [738, 979, 861, 948, 340, 646, 637, 545, 954, 562, 816, 987, 99, 400, 823, 619, 248, 89, 234, 721, 957, 90, 994, 777, 19, 110, 265, 32, 15, 904, 973, 774, 591, 912, 250, 337],
        candidatos: [777, 957],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 7"
        ],
        segredo: 957
    },
    {
        id: 47,
        numeros: [299, 495, 116, 497, 214, 348, 487, 419, 673, 447, 262, 458, 684, 870, 414, 139, 951, 896, 385, 183, 726, 666, 167, 415, 730, 417, 317, 940, 687, 434, 648, 70, 421, 693, 888, 76],
        candidatos: [447, 687],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 3"
        ],
        segredo: 687
    },
    {
        id: 48,
        numeros: [732, 124, 877, 112, 87, 275, 953, 289, 406, 86, 210, 906, 771, 438, 2, 796, 678, 205, 809, 949, 111, 725, 442, 50, 671, 184, 505, 276, 264, 931, 641, 40, 711, 57, 311, 867],
        candidatos: [87, 867],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 12"
        ],
        segredo: 867
    },
    {
        id: 49,
        numeros: [561, 826, 855, 556, 486, 383, 499, 290, 831, 998, 306, 615, 285, 96, 155, 308, 786, 203, 439, 874, 416, 781, 209, 36, 627, 734, 537, 803, 610, 237, 911, 180, 636, 884, 351, 47],
        candidatos: [537, 627],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 12"
        ],
        segredo: 537
    },
    {
        id: 50,
        numeros: [188, 239, 762, 717, 232, 350, 33, 327, 802, 260, 114, 945, 8, 810, 474, 993, 87, 889, 956, 109, 371, 983, 768, 322, 917, 559, 506, 54, 27, 935, 389, 450, 392, 745, 644, 883],
        candidatos: [87, 717],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 11"
        ],
        segredo: 87
    },
    {
        id: 51,
        numeros: [564, 800, 10, 833, 687, 331, 9, 324, 719, 196, 695, 313, 236, 147, 600, 794, 772, 242, 825, 270, 718, 562, 769, 179, 98, 193, 228, 790, 462, 763, 367, 982, 87, 969, 921, 405],
        candidatos: [87, 687],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 3"
        ],
        segredo: 687
    },
    {
        id: 52,
        numeros: [257, 756, 697, 700, 676, 741, 177, 313, 750, 68, 61, 282, 444, 238, 74, 650, 145, 258, 125, 893, 461, 267, 892, 57, 901, 376, 255, 518, 674, 149, 363, 955, 571, 48, 459, 962],
        candidatos: [177, 267],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 1"
        ],
        segredo: 267
    },
    {
        id: 53,
        numeros: [765, 326, 307, 463, 331, 965, 819, 653, 100, 304, 201, 490, 256, 84, 178, 507, 720, 151, 731, 923, 986, 781, 550, 795, 216, 384, 480, 586, 166, 150, 249, 394, 627, 182, 177, 791],
        candidatos: [177, 627],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 0"
        ],
        segredo: 627
    },
    {
        id: 54,
        numeros: [838, 249, 904, 254, 589, 700, 950, 628, 825, 277, 708, 120, 237, 962, 878, 130, 50, 82, 481, 418, 703, 569, 169, 480, 642, 807, 79, 928, 663, 267, 241, 253, 495, 250, 148, 783],
        candidatos: [267, 807],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 9"
        ],
        segredo: 807
    },
    {
        id: 55,
        numeros: [659, 94, 42, 30, 583, 267, 236, 799, 522, 376, 541, 402, 255, 867, 99, 476, 16, 850, 571, 713, 645, 474, 892, 765, 876, 507, 768, 780, 953, 606, 123, 939, 210, 121, 977, 842],
        candidatos: [267, 867],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 1"
        ],
        segredo: 267
    },
    {
        id: 56,
        numeros: [729, 662, 807, 979, 890, 246, 933, 491, 88, 327, 846, 271, 157, 698, 375, 617, 367, 546, 847, 695, 794, 870, 880, 163, 201, 124, 125, 906, 407, 424, 380, 447, 144, 408, 665, 404],
        candidatos: [447, 807],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 10"
        ],
        segredo: 447
    },
    {
        id: 57,
        numeros: [453, 517, 709, 627, 695, 745, 595, 37, 347, 343, 668, 358, 766, 71, 995, 546, 964, 272, 761, 740, 858, 585, 156, 692, 873, 148, 267, 274, 978, 500, 142, 507, 410, 969, 593, 133],
        candidatos: [267, 627],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 1"
        ],
        segredo: 267,
        pistasVerdadeiras: [false, true, false, true, false, true, true]
    },
    {
        id: 58,
        numeros: [206, 505, 606, 72, 271, 190, 758, 935, 443, 318, 699, 853, 415, 707, 66, 523, 231, 73, 385, 868, 177, 946, 41, 860, 52, 87, 388, 63, 848, 975, 688, 320, 409, 473, 382, 147],
        candidatos: [87, 177],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 11"
        ],
        segredo: 87,
        pistasVerdadeiras: [false, true, false, true, false, true, true]
    },
    {
        id: 59,
        numeros: [635, 611, 391, 374, 478, 121, 656, 971, 219, 952, 170, 3, 60, 5, 508, 491, 807, 210, 481, 56, 918, 446, 302, 746, 689, 932, 14, 999, 288, 897, 233, 955, 597, 67, 590, 780],
        candidatos: [597, 807],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 9"
        ],
        segredo: 807,
        pistasVerdadeiras: [false, true, false, true, false, true, true]
    },
    {
        id: 60,
        numeros: [504, 524, 364, 652, 360, 336, 748, 152, 325, 310, 985, 255, 90, 850, 586, 422, 866, 914, 378, 626, 82, 779, 131, 1, 907, 713, 467, 869, 683, 887, 819, 651, 741, 237, 177, 357],
        candidatos: [177, 357],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 6"
        ],
        segredo: 177,
        pistasVerdadeiras: [false, true, false, true, false, true, true]
    },
    {
        id: 61,
        numeros: [195, 117, 602, 74, 643, 512, 366, 449, 811, 267, 633, 494, 926, 430, 215, 960, 913, 425, 244, 164, 349, 820, 453, 806, 30, 490, 296, 502, 283, 128, 77, 472, 113, 701, 717, 57],
        candidatos: [267, 717],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 14"
        ],
        segredo: 717
    },
    {
        id: 62,
        numeros: [690, 427, 489, 484, 173, 552, 547, 395, 306, 537, 706, 327, 181, 50, 658, 793, 751, 982, 972, 18, 735, 455, 104, 176, 558, 583, 207, 810, 202, 220, 597, 988, 631, 7, 172, 849],
        candidatos: [537, 597],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 5"
        ],
        segredo: 537
    },
    {
        id: 63,
        numeros: [498, 729, 661, 716, 515, 61, 59, 258, 123, 842, 290, 532, 672, 765, 897, 224, 231, 617, 267, 198, 830, 702, 461, 976, 870, 965, 354, 767, 587, 580, 989, 986, 227, 687, 448, 160],
        candidatos: [267, 687],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 3"
        ],
        segredo: 687
    },
    {
        id: 64,
        numeros: [635, 611, 391, 374, 478, 121, 656, 971, 219, 952, 170, 3, 60, 5, 508, 491, 807, 210, 481, 56, 918, 446, 302, 746, 689, 932, 14, 999, 288, 897, 233, 955, 597, 67, 590, 780],
        candidatos: [597, 807],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 9"
        ],
        segredo: 807
    },
    {
        id: 65,
        numeros: [206, 505, 606, 72, 271, 190, 758, 935, 443, 318, 699, 853, 415, 707, 66, 523, 231, 73, 385, 868, 177, 946, 41, 860, 52, 87, 388, 63, 848, 975, 688, 320, 409, 473, 382, 147],
        candidatos: [87, 177],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 11"
        ],
        segredo: 87
    },
    {
        id: 66,
        numeros: [453, 517, 709, 627, 695, 745, 595, 37, 347, 343, 668, 358, 766, 71, 995, 546, 964, 272, 761, 740, 858, 585, 156, 692, 873, 148, 267, 274, 978, 500, 142, 507, 410, 969, 593, 133],
        candidatos: [267, 627],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 1"
        ],
        segredo: 267
    },
    {
        id: 67,
        numeros: [504, 524, 364, 652, 360, 336, 748, 152, 325, 310, 985, 255, 90, 850, 586, 422, 866, 914, 378, 626, 82, 779, 131, 1, 907, 713, 467, 869, 683, 887, 819, 651, 741, 237, 177, 357],
        candidatos: [177, 357],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 6"
        ],
        segredo: 177
    },
    {
        id: 68,
        numeros: [195, 117, 602, 74, 643, 512, 366, 449, 811, 267, 633, 494, 926, 430, 215, 960, 913, 425, 244, 164, 349, 820, 453, 806, 30, 490, 296, 502, 283, 128, 77, 472, 113, 701, 717, 57],
        candidatos: [267, 717],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 14"
        ],
        segredo: 717
    },
    {
        id: 69,
        numeros: [690, 427, 489, 484, 173, 552, 547, 395, 306, 537, 706, 327, 181, 50, 658, 793, 751, 982, 972, 18, 735, 455, 104, 176, 558, 583, 207, 810, 202, 220, 597, 988, 631, 7, 172, 849],
        candidatos: [537, 597],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 5"
        ],
        segredo: 537
    },
    {
        id: 70,
        numeros: [498, 729, 661, 716, 515, 61, 59, 258, 123, 842, 290, 532, 672, 765, 897, 224, 231, 617, 267, 198, 830, 702, 461, 976, 870, 965, 354, 767, 587, 580, 989, 986, 227, 687, 448, 160],
        candidatos: [267, 687],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 3"
        ],
        segredo: 687
    },
    {
        id: 71,
        numeros: [417, 822, 178, 662, 247, 996, 537, 242, 933, 827, 579, 881, 878, 470, 550, 691, 616, 319, 708, 754, 531, 970, 280, 65, 15, 357, 944, 92, 620, 977, 294, 43, 107, 569, 352, 835],
        candidatos: [357, 537],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 15"
        ],
        segredo: 357
    },
    {
        id: 72,
        numeros: [712, 714, 175, 368, 980, 863, 332, 285, 281, 145, 984, 778, 963, 342, 696, 807, 563, 578, 787, 798, 601, 560, 357, 723, 998, 301, 947, 910, 520, 451, 471, 895, 825, 91, 987, 682],
        candidatos: [357, 807],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 9"
        ],
        segredo: 807
    },
    {
        id: 73,
        numeros: [941, 321, 880, 784, 350, 4, 226, 733, 57, 718, 475, 445, 997, 536, 856, 267, 704, 909, 462, 663, 186, 341, 134, 613, 828, 790, 902, 899, 83, 727, 894, 165, 653, 284, 125, 87],
        candidatos: [87, 267],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 1"
        ],
        segredo: 267
    },
    {
        id: 74,
        numeros: [843, 135, 859, 151, 514, 541, 315, 510, 840, 140, 764, 263, 211, 450, 213, 886, 990, 468, 898, 627, 171, 836, 938, 222, 482, 760, 763, 452, 87, 479, 929, 670, 566, 697, 252, 507],
        candidatos: [87, 627],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 0"
        ],
        segredo: 627
    },
    {
        id: 75,
        numeros: [493, 698, 433, 939, 373, 402, 64, 240, 464, 804, 286, 782, 717, 715, 667, 788, 159, 10, 418, 174, 397, 783, 375, 632, 144, 241, 335, 885, 287, 605, 237, 49, 807, 654, 316, 553],
        candidatos: [717, 807],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 14"
        ],
        segredo: 717
    },
    {
        id: 76,
        numeros: [454, 594, 177, 513, 292, 509, 805, 867, 79, 759, 647, 170, 571, 24, 987, 97, 334, 786, 330, 312, 398, 372, 215, 126, 875, 930, 669, 936, 596, 428, 407, 534, 871, 212, 293, 137],
        candidatos: [177, 867],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 6"
        ],
        segredo: 177
    },
    {
        id: 77,
        numeros: [154, 629, 503, 743, 136, 900, 959, 832, 157, 21, 624, 924, 882, 957, 429, 327, 890, 345, 300, 618, 937, 29, 895, 506, 6, 990, 430, 80, 814, 570, 736, 839, 867, 379, 966, 243],
        candidatos: [867, 957],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 6"
        ],
        segredo: 957
    },
    {
        id: 78,
        numeros: [219, 598, 664, 413, 44, 874, 396, 166, 28, 323, 792, 149, 344, 807, 303, 515, 762, 251, 703, 20, 645, 919, 78, 259, 925, 395, 538, 943, 621, 87, 394, 510, 675, 897, 143, 208],
        candidatos: [87, 807],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 11"
        ],
        segredo: 87
    },
    {
        id: 79,
        numeros: [475, 355, 609, 282, 527, 742, 261, 582, 108, 533, 440, 356, 496, 425, 916, 447, 634, 314, 876, 87, 967, 307, 679, 903, 630, 775, 640, 622, 120, 934, 655, 119, 857, 417, 551, 607],
        candidatos: [87, 447],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 10"
        ],
        segredo: 447
    },
    {
        id: 80,
        numeros: [169, 147, 574, 245, 872, 191, 841, 114, 557, 115, 432, 851, 192, 194, 339, 710, 163, 361, 686, 962, 146, 516, 584, 715, 612, 411, 31, 118, 537, 420, 447, 269, 690, 835, 200, 441],
        candidatos: [447, 537],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 5"
        ],
        segredo: 537
    },
    {
        id: 81,
        numeros: [46, 799, 11, 544, 492, 195, 589, 130, 821, 608, 908, 818, 353, 543, 295, 864, 463, 605, 922, 777, 537, 322, 638, 329, 426, 105, 749, 927, 739, 465, 592, 147, 238, 204, 808, 681],
        candidatos: [537, 777],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 17"
        ],
        segredo: 777
    },
    {
        id: 82,
        numeros: [16, 13, 168, 266, 127, 623, 897, 474, 867, 659, 199, 735, 377, 744, 680, 488, 309, 399, 175, 103, 246, 950, 158, 26, 165, 369, 537, 722, 456, 923, 826, 670, 685, 17, 724, 548],
        candidatos: [537, 867],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 12"
        ],
        segredo: 867
    },
    {
        id: 83,
        numeros: [540, 62, 521, 93, 829, 507, 23, 101, 476, 879, 791, 162, 526, 182, 590, 218, 597, 833, 785, 387, 380, 58, 830, 572, 568, 254, 852, 403, 581, 404, 310, 776, 87, 995, 885, 457],
        candidatos: [87, 597],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 8"
        ],
        segredo: 597
    },
    {
        id: 84,
        numeros: [738, 979, 861, 948, 340, 646, 637, 545, 954, 562, 816, 987, 99, 400, 823, 619, 248, 89, 234, 721, 957, 90, 994, 777, 19, 110, 265, 32, 15, 904, 973, 774, 591, 912, 250, 337],
        candidatos: [777, 957],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 7"
        ],
        segredo: 957
    },
    {
        id: 85,
        numeros: [299, 495, 116, 497, 214, 348, 487, 419, 673, 447, 262, 458, 684, 870, 414, 139, 951, 896, 385, 183, 726, 666, 167, 415, 730, 417, 317, 940, 687, 434, 648, 70, 421, 693, 888, 76],
        candidatos: [447, 687],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 3"
        ],
        segredo: 687
    },
    {
        id: 86,
        numeros: [732, 124, 877, 112, 87, 275, 953, 289, 406, 86, 210, 906, 771, 438, 2, 796, 678, 205, 809, 949, 111, 725, 442, 50, 671, 184, 505, 276, 264, 931, 641, 40, 711, 57, 311, 867],
        candidatos: [87, 867],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 12"
        ],
        segredo: 867
    },
    {
        id: 87,
        numeros: [561, 826, 855, 556, 486, 383, 499, 290, 831, 998, 306, 615, 285, 96, 155, 308, 786, 203, 439, 874, 416, 781, 209, 36, 627, 734, 537, 803, 610, 237, 911, 180, 636, 884, 351, 47],
        candidatos: [537, 627],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 12"
        ],
        segredo: 537
    },
    {
        id: 88,
        numeros: [188, 239, 762, 717, 232, 350, 33, 327, 802, 260, 114, 945, 8, 810, 474, 993, 87, 889, 956, 109, 371, 983, 768, 322, 917, 559, 506, 54, 27, 935, 389, 450, 392, 745, 644, 883],
        candidatos: [87, 717],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 11"
        ],
        segredo: 87
    },
    {
        id: 89,
        numeros: [564, 800, 10, 833, 687, 331, 9, 324, 719, 196, 695, 313, 236, 147, 600, 794, 772, 242, 825, 270, 718, 562, 769, 179, 98, 193, 228, 790, 462, 763, 367, 982, 87, 969, 921, 405],
        candidatos: [87, 687],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 3"
        ],
        segredo: 687
    },
    {
        id: 90,
        numeros: [257, 756, 697, 700, 676, 741, 177, 313, 750, 68, 61, 282, 444, 238, 74, 650, 145, 258, 125, 893, 461, 267, 892, 57, 901, 376, 255, 518, 674, 149, 363, 955, 571, 48, 459, 962],
        candidatos: [177, 267],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 1"
        ],
        segredo: 267
    },
    {
        id: 91,
        numeros: [765, 326, 307, 463, 331, 965, 819, 653, 100, 304, 201, 490, 256, 84, 178, 507, 720, 151, 731, 923, 986, 781, 550, 795, 216, 384, 480, 586, 166, 150, 249, 394, 627, 182, 177, 791],
        candidatos: [177, 627],
        dicasFinais: [
            "O produto dos seus algarismos é divisível por 7",
            "O resto da divisão por 15 é 12",
            "O resto da divisão do número por 19 dará o resto 0"
        ],
        segredo: 627
    }
];

let currentTabuleiro = null;
let currentTabuleiroIndex = 0; // Índice do tabuleiro atual
let round = 0;
let time = 0; // Tempo começa em 0 e conta para cima
let timerInterval = null; // Para armazenar o intervalo do timer
let playerName = ''; // Para armazenar o nome do jogador
let errorCount = 0; // Contador de erros por pista (resetado a cada pista)

// Variáveis para controle de spam e tentativas aleatórias
let lastClickTime = 0; // Último momento em que um número foi clicado
let clickCooldown = 800; // Tempo mínimo entre cliques (aumentado para 800ms)
let clickCount = 0; // Contador de cliques em um curto período
let clickCountResetTimeout = null; // Timeout para resetar o contador de cliques
let isClickBlocked = false; // Flag para indicar se os cliques estão bloqueados

// Controle de tentativas incorretas consecutivas
let wrongAttemptsInRow = 0; // Tentativas erradas consecutivas
let totalWrongAttempts = 0; // Total de tentativas erradas na pista atual
let blockDuration = 3000; // Duração inicial do bloqueio (3 segundos)
let maxWrongAttempts = 3; // Máximo de tentativas erradas antes de penalidade maior



// Função auxiliar para somar os algarismos de um número
function sumDigits(n){
   return String(n).split('').reduce((a,b)=>a+parseInt(b),0);
}

// Função para atualizar a barra de progresso
function updateLoadingProgress(percent, message) {
    const loadingBar = document.getElementById('loading-bar');
    const loadingMessage = document.getElementById('loading-message');

    if (loadingBar) {
        loadingBar.style.width = `${percent}%`;
    }

    if (loadingMessage && message) {
        loadingMessage.textContent = message;
    }
}

// Função para iniciar o jogo com o nome do jogador
async function startGameWithPlayerName() {
    const nameInput = document.getElementById('player-name-input');
    playerName = nameInput.value.trim();

    if (!playerName) {
        nameInput.classList.add('shake');
        setTimeout(() => nameInput.classList.remove('shake'), 500);
        return;
    }

    // Inicializar áudio quando o usuário interagir
    if (!backgroundMusic) {
        initializeAudio();
    }
    
    // Tentar reproduzir a música quando o jogo começar
    if (backgroundMusic) {
        backgroundMusic.play().catch(error => {
            console.log('Autoplay bloqueado, música será iniciada após interação:', error);
        });
    }

    // Esconder o modal de nome
    document.getElementById('player-name-modal').style.display = 'none';

    // Mostrar a tela de carregamento
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.remove('hidden');
    updateLoadingProgress(0, 'Iniciando o jogo...');

    // Pequeno atraso para garantir que a tela de carregamento seja exibida
    setTimeout(async () => {
        try {
            // Inicializar o jogo
            await initializeGame();

            // Esconder a tela de carregamento quando o jogo estiver pronto
            loadingScreen.classList.add('hidden');
        } catch (error) {
            console.error('Erro ao inicializar o jogo:', error);
            alert('Ocorreu um erro ao inicializar o jogo. Por favor, recarregue a página.');
            loadingScreen.classList.add('hidden');
        }
    }, 100);
}

// Função para inicializar o jogo
async function initializeGame() {
    try {
        // Resetar todas as variáveis do jogo
        round = 0;
        time = 0;
        errorCount = 0;
        wrongAttemptsInRow = 0;
        totalWrongAttempts = 0;
        clickCount = 0;
        isClickBlocked = false;
        lastClickTime = 0;

        // Atualizar a barra de progresso
        updateLoadingProgress(10, 'Inicializando o jogo...');

        // Garantir que cada regra tenha a propriedade isTrue definida como verdadeira
        FIXED_RULES_BASE.forEach(rule => {
            rule.isTrue = true; // Todas as pistas são sempre verdadeiras
        });

        updateLoadingProgress(30, 'Processando protocolos de segurança...');

        updateLoadingProgress(40, 'Gerando matriz de códigos...');

        updateLoadingProgress(50, 'Selecionando tabuleiro...');

        // Gerar um tabuleiro do PDF (sempre válido)
        currentTabuleiro = generateRandomTabuleiro();

        updateLoadingProgress(70, 'Validando códigos de segurança...');

        console.log('Tabuleiro do PDF carregado com sucesso!');
        console.log('Segredo:', currentTabuleiro.segredo);
        console.log('Sobreviventes:', currentTabuleiro.sobreviventes);
        console.log('Tabuleiro ID:', currentTabuleiro.tabuleiroId);

        updateLoadingProgress(80, 'Carregando interface de segurança...');

        // Gerar o tabuleiro na interface
        generateBoard();

        updateLoadingProgress(90, 'Estabelecendo conexão segura...');

        // Exibir a primeira dica com o detetive indicando se é verdadeira ou falsa
        const regra = currentTabuleiro.regras[round];

        // Definir cores para cada pista com melhor contraste
        const coresPistas = [
            '#8A2BE2',  // Azul violeta (mais escuro que retro-purple)
            '#FF1493',  // Rosa profundo (mais escuro que retro-pink)
            '#00868B',  // Ciano escuro (mais escuro que retro-cyan)
            '#B8860B',  // Dourado escuro (mais escuro que retro-yellow)
            '#D2691E',  // Chocolate (mais escuro que retro-orange)
            '#228B22',  // Verde floresta (mais escuro que accent-color)
            '#B22222'   // Vermelho tijolo (mais escuro que primary-color)
        ];

        const corAtual = coresPistas[round % coresPistas.length];

        // Melhorar o feedback visual para pistas verdadeiras/falsas usando variáveis CSS
        const detetiveIcon = regra.isTrue ?
            `<div style="display: inline-flex; align-items: center; background-color: var(--true-color); padding: 5px 10px; border-radius: 5px; margin-right: 10px; border: 2px solid #FFFFFF;">
                <i class="fas fa-check-circle" style="color: #FFFFFF; margin-right: 5px;"></i>
                <span style="color: #FFFFFF; font-weight: bold; text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);">VERDADEIRA</span>
            </div> ` :
            `<div style="display: inline-flex; align-items: center; background-color: var(--false-color); padding: 5px 10px; border-radius: 5px; margin-right: 10px; border: 2px solid #FFFFFF;">
                <i class="fas fa-times-circle" style="color: #FFFFFF; margin-right: 5px;"></i>
                <span style="color: #FFFFFF; font-weight: bold; text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);">FALSA</span>
            </div> `;

        const regraElement = document.getElementById('rule');
        regraElement.innerHTML = detetiveIcon + regra.texto;

        // Atualizar a cor da regra container para combinar com a pista atual
        const regraContainer = document.querySelector('.rule-container');
        if (regraContainer) {
            regraContainer.style.backgroundColor = corAtual;
            regraContainer.style.borderColor = "#FFFFFF";
            regraContainer.style.color = "#FFFFFF";

            // Garantir que o texto da regra seja branco para melhor contraste
            regraElement.style.color = "#FFFFFF";
            regraElement.style.textShadow = "2px 2px 0 rgba(0, 0, 0, 0.5)";

            // Garantir que o ícone também tenha boa visibilidade
            const iconElement = regraContainer.querySelector("i.fa-lightbulb");
            if (iconElement) {
                iconElement.style.color = "#FFFFFF";
            }
        }

        updateLoadingProgress(100, 'Sistema bancário ativo!');

        // Iniciar o timer
        startTimer();


    } catch (error) {
        console.error('Erro ao inicializar o jogo:', error);
        alert('Ocorreu um erro ao inicializar o jogo. Por favor, recarregue a página.');
    }
}

window.addEventListener('DOMContentLoaded', function() {
    // Mostrar o modal para inserir o nome do jogador
    document.getElementById('player-name-modal').style.display = 'flex';

    // Focar no campo de entrada de nome
    document.getElementById('player-name-input').focus();

    // Permitir pressionar Enter para iniciar o jogo
    document.getElementById('player-name-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            startGameWithPlayerName();
        }
    });
});

// Função para gerar configurações de pistas - todas sempre verdadeiras
function gerarPistasAleatorias() {
    return Array.from({length: 7}, () => true);
}

function generateRandomTabuleiro() {
    // Escolher um tabuleiro aleatório do PDF
    const tabuleiroEscolhido = TABULEIROS_PDF[Math.floor(Math.random() * TABULEIROS_PDF.length)];

    // Atualizar o índice do tabuleiro atual
    currentTabuleiroIndex = TABULEIROS_PDF.findIndex(t => t.id === tabuleiroEscolhido.id);

    console.log(`Tabuleiro escolhido: ${tabuleiroEscolhido.id}`);
    console.log(`Segredo: ${tabuleiroEscolhido.segredo}`);
    console.log(`Candidatos: ${tabuleiroEscolhido.candidatos.join(', ')}`);

    // Todas as pistas são sempre verdadeiras
    const pistasVerdadeiras = Array.from({length: 7}, () => true);

    // Criar as regras com base nas configurações de verdadeiro/falso
    const regras = FIXED_RULES_BASE.map((regra) => ({
        ...regra,
        isTrue: true
    }));

    console.log(`Configuração das pistas: ${pistasVerdadeiras.map(v => v ? 'V' : 'F').join(', ')}`);

    // Retornar o tabuleiro do PDF formatado para o jogo
    return {
        numeros: tabuleiroEscolhido.numeros.map(valor => ({ valor })),
        regras: regras,
        dicasFinais: tabuleiroEscolhido.dicasFinais,
        segredo: tabuleiroEscolhido.segredo,
        sobreviventes: tabuleiroEscolhido.candidatos, // Os candidatos são os sobreviventes
        tabuleiroId: tabuleiroEscolhido.id
    };
}

function generateRandomNumbers(count){
    const numbers = new Set();
    while(numbers.size < count) {
        // Reduzir ainda mais a chance de números de 3 algarismos
        // 90% de chance de gerar números de 1-2 algarismos (1-99)
        // 10% de chance de gerar números de 3 algarismos (100-999)
        let num;
        if (Math.random() < 0.9) {
            // Gerar número de 1-2 algarismos (1-99)
            num = Math.floor(Math.random() * 99) + 1;
        } else {
            // Gerar número de 3 algarismos (100-999)
            // Limitar a números menores para melhor visualização
            num = Math.floor(Math.random() * 400) + 100;
        }
        numbers.add(num);
    }
    return Array.from(numbers);
}



// Função para verificar se uma regra é aplicável ao tabuleiro atual
function isRuleApplicable(rule, numeros, segredo) {
    // Verifica se existem números que atendem à regra, considerando se é verdadeira ou falsa
    const numerosQueAtendem = rule.isTrue ?
        numeros.filter(n => rule.check(n)) :
        numeros.filter(n => !rule.check(n));

    // Verifica se o segredo não é eliminado pela regra, considerando se é verdadeira ou falsa
    const segredoSobrevive = rule.isTrue ?
        !rule.check(segredo) :
        rule.check(segredo);

    // A regra é aplicável se existem números para marcar e o segredo sobrevive
    return numerosQueAtendem.length > 0 && segredoSobrevive;
}
function generateFinalHints(segredo) {
  // Se o tabuleiro já tem dicas finais do PDF, usar elas
  if (currentTabuleiro && currentTabuleiro.dicasFinais && currentTabuleiro.dicasFinais.length > 0) {
    return currentTabuleiro.dicasFinais;
  }

  // Caso contrário, gerar dicas como antes (fallback)
  let nums = [];

  // Se o tabuleiro tem sobreviventes, usamos eles
  if (currentTabuleiro && currentTabuleiro.sobreviventes && currentTabuleiro.sobreviventes.length === 2) {
    nums = [...currentTabuleiro.sobreviventes];
  } else {
    // Usar o segredo e um número aleatório como fallback
    nums = [segredo, segredo + (Math.random() < 0.5 ? 1 : -1)];
  }

  // Garantir que o segredo está na lista
  if (!nums.includes(segredo)) {
    nums[1] = segredo;
  }

  // Ordenar os números para facilitar a comparação
  nums.sort((a, b) => a - b);

  // Obter o outro número (não o segredo)
  const outroNumero = nums[0] === segredo ? nums[1] : nums[0];

  // Inicializar o array de dicas
  const dicas = [];

  // Primeira dica - sempre a mesma: resto da divisão por 7
  dicas.push(`O resto da divisão por 7 é ${segredo % 7}`);

  // Segunda dica - sempre aleatória entre as opções que diferenciam os dois números
  const diferencas = [
    // Comparação de tamanho
    segredo > outroNumero ?
      `O número secreto é maior que ${outroNumero}` :
      `O número secreto é menor que ${outroNumero}`,

    // Paridade
    segredo % 2 === 0 ?
      `O número secreto é par` :
      `O número secreto é ímpar`,

    // Último dígito
    `O último dígito do número secreto é ${segredo % 10}`
  ];

  // Escolher uma dica aleatória que diferencie os dois números
  const dicaAleatoria = diferencas[Math.floor(Math.random() * diferencas.length)];
  dicas.push(dicaAleatoria);

  return dicas;
}

function generateBoard(){
    const board=document.getElementById('board');
    board.innerHTML='';

    // Calcular quantos números reais temos para distribuir
    const totalNumeros = currentTabuleiro.numeros.length;

    // Criar botões diretamente no grid (CSS Grid irá organizar automaticamente)
    for(let i = 0; i < totalNumeros; i++){
        const btn=document.createElement('button');
        btn.textContent=currentTabuleiro.numeros[i].valor;
        btn.addEventListener('click',markNumber);

        // Ajustar o tamanho do botão com base no número de dígitos
        const numDigits = btn.textContent.length;
        if (numDigits > 2) {
            btn.style.fontSize = '0.9rem'; // Fonte menor para números de 3 dígitos
            btn.style.lineHeight = '0.9'; // Reduzir espaçamento entre linhas
        } else if (numDigits == 2) {
            btn.style.fontSize = '1rem'; // Tamanho médio para números de 2 dígitos
        } else {
            btn.style.fontSize = '1.1rem'; // Tamanho maior para números de 1 dígito
        }

        board.appendChild(btn);
    }
}

function startTimer(){
 timerInterval = setInterval(()=>{
   time++;
   let m=Math.floor(time/60), s=time%60;
   document.getElementById('timer').textContent=`Tempo: ${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
 },1000);
}

function markNumber(event){
    const btn = event.target;
    if (btn.classList.contains('marked') || btn.disabled){
        return; // evita clique se já marcado ou desabilitado
    }

    // Verificar se os cliques estão bloqueados
    if (isClickBlocked) {
        // Adicionar efeito visual para indicar que os cliques estão bloqueados
        btn.classList.add('blocked');
        setTimeout(() => btn.classList.remove('blocked'), 300);
        return;
    }

    // Verificar o tempo desde o último clique
    const currentTime = Date.now();
    if (currentTime - lastClickTime < clickCooldown) {
        // Clique muito rápido, incrementar contador
        clickCount++;

        // Se exceder o limite de cliques rápidos, bloquear temporariamente
        if (clickCount >= 3) { // Reduzido de 5 para 3
            isClickBlocked = true;

            // Aumentar duração do bloqueio baseado no número de tentativas erradas
            const currentBlockDuration = blockDuration + (wrongAttemptsInRow * 2000); // +2s por tentativa errada

            // Mostrar mensagem de aviso mais específica
            showModal('🛑 Pare e Pense!',
                `Você está clicando muito rápido! Isso parece tentativa aleatória.
                Analise a pista com cuidado antes de clicar.
                Bloqueio por ${Math.ceil(currentBlockDuration/1000)} segundos.`);

            // Desbloquear após o tempo calculado
            setTimeout(() => {
                isClickBlocked = false;
                clickCount = 0;
                showAlert("🔓 Cliques liberados. Lembre-se: qualidade > velocidade!", 3000);
            }, currentBlockDuration);

            return;
        }

        // Resetar o contador após 5 segundos sem cliques rápidos
        clearTimeout(clickCountResetTimeout);
        clickCountResetTimeout = setTimeout(() => {
            clickCount = 0;
        }, 5000);
    } else {
        // Clique com intervalo adequado, resetar contador
        clickCount = 0;
    }

    // Atualizar o tempo do último clique
    lastClickTime = currentTime;

    const numero = parseInt(btn.textContent);
    const regra = currentTabuleiro.regras[round];

    // Verificar se a regra é verdadeira ou falsa e aplicar a lógica correspondente
    // Se a regra é verdadeira, eliminamos números que NÃO se encaixam na descrição
    // Se a regra é falsa, eliminamos números que SE encaixam na descrição
    const shouldMark = regra.isTrue ? !regra.check(numero) : regra.check(numero);

    if(shouldMark){
        btn.classList.add('marked');
        // Adicionar a classe correspondente à pista atual
        btn.classList.add(`clue-${round}`);
        btn.classList.add('pulse');
        btn.disabled = true; // Não deixa clicar novamente
        setTimeout(()=>btn.classList.remove('pulse'),300);

        // Clique correto - resetar contador de tentativas erradas consecutivas
        wrongAttemptsInRow = 0;
    }else{
        // Incrementar contadores de erro
        errorCount++;
        wrongAttemptsInRow++;
        totalWrongAttempts++;

        btn.classList.add('shake');
        document.getElementById('alert').textContent="Número não atende a regra!";

        // Aplicar penalidades progressivas por tentativas incorretas consecutivas
        if (wrongAttemptsInRow >= maxWrongAttempts) {
            isClickBlocked = true;
            const penaltyDuration = 5000 + (wrongAttemptsInRow - maxWrongAttempts) * 3000; // 5s + 3s por tentativa extra

            showModal('🚫 Muitas Tentativas Incorretas!',
                `Você errou ${wrongAttemptsInRow} vezes seguidas!
                Isso sugere tentativas aleatórias.
                Bloqueio por ${Math.ceil(penaltyDuration/1000)} segundos.
                Use este tempo para analisar a pista com cuidado.`);

            setTimeout(() => {
                isClickBlocked = false;
                showAlert("🎯 Foque na lógica da pista antes de clicar!", 4000);
            }, penaltyDuration);

            return;
        }

        // Registrar erro na pista no banco de dados
        if (regra.id) {
            try {
                registerRuleError(regra.id).catch(error => {
                    console.error('Erro ao registrar erro na pista:', error);
                    // Continuar o jogo mesmo se houver erro ao registrar o erro
                });
            } catch (error) {
                console.error('Erro ao tentar registrar erro na pista:', error);
                // Continuar o jogo mesmo se houver erro ao registrar o erro
            }
        }

        // Verificar o número de erros e mostrar mensagens apropriadas
        if (errorCount === 1) {
            // Após o primeiro erro, mostrar modal sobre a veracidade da pista atual
            setTimeout(() => {
                // Criar uma mensagem específica para a pista atual
                let mensagem = 'Preste atenção na veracidade desta pista!';
                if (regra.isTrue) {
                    mensagem += ' Esta pista é VERDADEIRA, então você deve marcar os números que NÃO se encaixam na descrição (pois o segredo se encaixa).';
                } else {
                    mensagem += ' Esta pista é FALSA, então você deve marcar os números que SE encaixam na descrição (pois o segredo não se encaixa).';
                }
                showModal('Atenção!', mensagem);
            }, 600);
        } else if (errorCount === 2) {
            // Após o segundo erro, dar uma dica específica relacionada à pista atual
            setTimeout(() => {
                // Gerar uma dica específica com base no tipo de regra atual
                let mensagemDica = 'Dica: ';

                // Analisar o texto da regra para determinar o tipo de dica a ser dada
                if (regra.texto.includes("múltiplo de 4")) {
                    mensagemDica += "Um número é múltiplo de 4 quando seus dois últimos dígitos formam um número divisível por 4.";
                }
                else if (regra.texto.includes("divisível por 5")) {
                    mensagemDica += "Um número é divisível por 5 quando termina em 0 ou 5.";
                }
                else if (regra.texto.includes("é par")) {
                    mensagemDica += "Números pares são aqueles que terminam em 0, 2, 4, 6 ou 8.";
                }
                else if (regra.texto.includes("múltiplo de 3")) {
                    mensagemDica += "Um número é múltiplo de 3 quando a soma de seus algarismos é divisível por 3.";
                }
                else if (regra.texto.includes("divisível por 9")) {
                    mensagemDica += "Um número é divisível por 9 quando a soma de seus algarismos é divisível por 9.";
                }
                else if (regra.texto.includes("resto da divisão")) {
                    mensagemDica += "Números que terminam em 2 ou 7 têm resto 2 quando divididos por 5.";
                }
                else if (regra.texto.includes("soma dos algarismos")) {
                    mensagemDica += "Para saber se a soma dos algarismos é ímpar, some todos os dígitos e veja se o resultado termina em 1, 3, 5, 7 ou 9.";
                }
                else {
                    // Dica genérica caso não identifique o tipo de regra
                    mensagemDica += "Analise cuidadosamente a regra e lembre-se de considerar se ela é verdadeira ou falsa.";
                }

                showModal('Dica!', mensagemDica);
            }, 600);
        }

        setTimeout(()=>{
            btn.classList.remove('shake');
            document.getElementById('alert').textContent="";
        },500);
    }
}

function verificarNumerosCorretos() {
    // Verificar se estamos em um round válido
    if (round >= ROUNDS || !currentTabuleiro.regras[round]) {
        return true; // Se não há regra atual, consideramos que está correto
    }

    const regraAtual = currentTabuleiro.regras[round];
    const todosOsBotoes = document.querySelectorAll('#board button');

    // Verificar se existem números para marcar
    let existemNumerosParaMarcar = false;

    // Usar um loop for tradicional para evitar problemas com forEach
    for (let idx = 0; idx < currentTabuleiro.numeros.length; idx++) {
        const numero = currentTabuleiro.numeros[idx];
        // Considerar se a regra é verdadeira ou falsa
        const shouldMark = regraAtual.isTrue ? regraAtual.check(numero.valor) : !regraAtual.check(numero.valor);
        if (idx < todosOsBotoes.length && shouldMark) {
            existemNumerosParaMarcar = true;
            break;
        }
    }

    // Se não houver números para marcar, consideramos que está correto
    if (!existemNumerosParaMarcar) {
        return true;
    }

    // Caso contrário, verificamos se todos os números que deveriam ser marcados foram marcados
    for (let idx = 0; idx < currentTabuleiro.numeros.length; idx++) {
        const numero = currentTabuleiro.numeros[idx];
        if (idx >= todosOsBotoes.length) continue;

        const btn = todosOsBotoes[idx];
        // Considerar se a regra é verdadeira ou falsa
        const shouldMark = regraAtual.isTrue ? regraAtual.check(numero.valor) : !regraAtual.check(numero.valor);
        if (shouldMark && !btn.classList.contains('marked')) {
            return false; // Encontrou um número que deveria ser marcado mas não foi
        }
    }

    return true; // Todos os números que deveriam ser marcados foram marcados
}

function verificarSeExistemNumerosParaMarcar(roundIndex) {
    // Verifica se existem números para marcar na regra especificada
    if (roundIndex >= ROUNDS || !currentTabuleiro.regras[roundIndex]) {
        return false;
    }

    const regra = currentTabuleiro.regras[roundIndex];
    const numerosNaoMarcados = document.querySelectorAll('#board button:not(.marked):not(:disabled)');

    // Se não houver botões disponíveis, não há números para marcar
    if (numerosNaoMarcados.length === 0) {
        return false;
    }

    // Verificar se algum dos botões não marcados atende à regra
    let encontrouNumeroParaMarcar = false;
    for (let i = 0; i < numerosNaoMarcados.length; i++) {
        const numero = parseInt(numerosNaoMarcados[i].textContent);
        // Considerar se a regra é verdadeira ou falsa
        // Se a regra é verdadeira, eliminamos números que NÃO se encaixam na descrição
        // Se a regra é falsa, eliminamos números que SE encaixam na descrição
        const shouldMark = regra.isTrue ? !regra.check(numero) : regra.check(numero);
        if (shouldMark) {
            encontrouNumeroParaMarcar = true;
            break;
        }
    }

    // Se não encontrou nenhum número para marcar, avance automaticamente
    if (!encontrouNumeroParaMarcar) {
        console.log(`Nenhum número para marcar na pista ${roundIndex + 1}. Avançando automaticamente.`);
    }

    return encontrouNumeroParaMarcar;
}

function avancarParaProximaPistaValida() {
    // Avança para a próxima pista que tenha números para marcar
    let proximoRound = round + 1;

    // Procurar a próxima pista válida
    while (proximoRound < ROUNDS && !verificarSeExistemNumerosParaMarcar(proximoRound)) {
        console.log(`Pulando pista ${proximoRound + 1} porque não há números para marcar.`);
        proximoRound++;
    }

    // Atualizar o round e a interface
    round = proximoRound;

    // Resetar os contadores de erros ao avançar para uma nova pista
    errorCount = 0;
    totalWrongAttempts = 0;
    // Não resetar wrongAttemptsInRow para manter penalidade entre pistas

    if (round < ROUNDS) {
        // Ainda temos pistas válidas
        const regraElement = document.getElementById('rule');
        if (regraElement && currentTabuleiro.regras[round]) {
            // Atualizar o texto da regra com o detetive indicando se é verdadeira ou falsa
            const regra = currentTabuleiro.regras[round];

            // Definir cores para cada pista com melhor contraste
            const coresPistas = [
                '#8A2BE2',  // Azul violeta (mais escuro que retro-purple)
                '#FF1493',  // Rosa profundo (mais escuro que retro-pink)
                '#00868B',  // Ciano escuro (mais escuro que retro-cyan)
                '#B8860B',  // Dourado escuro (mais escuro que retro-yellow)
                '#D2691E',  // Chocolate (mais escuro que retro-orange)
                '#228B22',  // Verde floresta (mais escuro que accent-color)
                '#B22222'   // Vermelho tijolo (mais escuro que primary-color)
            ];

            const corAtual = coresPistas[round % coresPistas.length];

            // Sempre usar texto branco para garantir legibilidade
            const detetiveIcon = regra.isTrue ?
                `<i class="fas fa-user-secret" style="color: #00FF00;"></i> <span style="color: #FFFFFF; font-weight: bold; text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);">VERDADEIRA:</span> ` :
                `<i class="fas fa-user-secret" style="color: #FF0000;"></i> <span style="color: #FFFFFF; font-weight: bold; text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);">FALSA:</span> `;

            regraElement.innerHTML = detetiveIcon + regra.texto;

            // Atualizar a cor da regra container para combinar com a pista atual
            const regraContainer = document.querySelector('.rule-container');
            if (regraContainer) {
                regraContainer.style.backgroundColor = corAtual;
                regraContainer.style.borderColor = "#FFFFFF";
                regraContainer.style.color = "#FFFFFF";

                // Garantir que o texto da regra seja branco para melhor contraste
                regraElement.style.color = "#FFFFFF";
                regraElement.style.textShadow = "2px 2px 0 rgba(0, 0, 0, 0.5)";

                // Garantir que o ícone também tenha boa visibilidade
                const iconElement = regraContainer.querySelector("i.fa-lightbulb");
                if (iconElement) {
                    iconElement.style.color = "#FFFFFF";
                }
            }
            console.log(`Avançando para a pista ${round + 1}: ${regra.texto} (${regra.isTrue ? 'Verdadeira' : 'Falsa'})`);
        }
    } else {
        // Chegamos ao final das pistas
        // Verificar se restam apenas 2 números não marcados
        const numerosRestantes = document.querySelectorAll('#board button:not(.marked):not(:disabled)');
        console.log(`Chegamos ao final das pistas. Restam ${numerosRestantes.length} números.`);

        if (numerosRestantes.length > 2) {
            alert("Você precisa eliminar mais números! Devem restar apenas 2 números.");
            // Voltar para a última pista válida
            round = ROUNDS - 1;
            return false;
        } else if (numerosRestantes.length < 2) {
            alert("Erro: Restam menos de 2 números. Isso não deveria acontecer.");
            return false;
        }

        // Ir direto para a tela de adivinhar o segredo
        checkFinalNumbers();
        console.log("Avançando para a última etapa!");

        // Resetar o contador de erros ao chegar na tela final
        errorCount = 0;
    }

    return true;
}

function nextRound() {
    // Verificar se os cliques estão bloqueados
    if (isClickBlocked) {
        document.getElementById('alert').textContent = "Aguarde o desbloqueio para avançar.";
        setTimeout(() => {
            document.getElementById('alert').textContent = "";
        }, 2000);
        return false;
    }

    // Verificar o tempo desde o último clique
    const currentTime = Date.now();
    if (currentTime - lastClickTime < clickCooldown) {
        // Clique muito rápido, incrementar contador
        clickCount++;

        // Se exceder o limite de cliques rápidos, bloquear temporariamente
        if (clickCount >= 5) {
            isClickBlocked = true;

            // Mostrar mensagem de aviso
            showModal('Calma!', 'Você está clicando muito rápido! Pense antes de avançar. Os cliques serão bloqueados por alguns segundos.');

            // Desbloquear após 3 segundos
            setTimeout(() => {
                isClickBlocked = false;
                clickCount = 0;
                document.getElementById('alert').textContent = "Cliques desbloqueados. Pense antes de avançar!";
                setTimeout(() => {
                    document.getElementById('alert').textContent = "";
                }, 2000);
            }, 3000);

            return false;
        }

        // Resetar o contador após 5 segundos sem cliques rápidos
        clearTimeout(clickCountResetTimeout);
        clickCountResetTimeout = setTimeout(() => {
            clickCount = 0;
        }, 5000);
    } else {
        // Clique com intervalo adequado, resetar contador
        clickCount = 0;
    }

    // Atualizar o tempo do último clique
    lastClickTime = currentTime;

    // Verificar se há números para marcar na regra atual
    if (round < ROUNDS && currentTabuleiro.regras[round]) {
        const existemNumerosParaMarcar = verificarSeExistemNumerosParaMarcar(round);

        if (!existemNumerosParaMarcar) {
            // Se não houver números para marcar, avançamos automaticamente
            return avancarParaProximaPistaValida();
        }

        if (!verificarNumerosCorretos()) {
            alert("Marque corretamente os números antes de avançar!");
            return false;
        }
    }

    // Verificar se estamos na última pista
    if (round >= ROUNDS - 1) {
        // Verificar se restam apenas 2 números não marcados
        const numerosRestantes = document.querySelectorAll('#board button:not(.marked):not(:disabled)');
        if (numerosRestantes.length > 2) {
            alert("Você precisa eliminar mais números! Devem restar apenas 2 números.");
            return false;
        }

        // Ir direto para a tela de adivinhar o segredo
        checkFinalNumbers();
        return true;
    }

    // Avançar para a próxima pista válida
    return avancarParaProximaPistaValida();
}

function checkFinalNumbers(){
  // Obter os números restantes
  const numerosRestantes = document.querySelectorAll('#board button:not(.marked):not(:disabled)');

  // Mostrar a tela de adivinhar o segredo
  document.getElementById('end-game').classList.remove('hidden');

  // Mostrar os números restantes no painel de dicas finais
  const remainingNumbersContainer = document.getElementById('remaining-numbers-end');
  remainingNumbersContainer.innerHTML = '';

  numerosRestantes.forEach(btn => {
    const numero = btn.textContent;
    const numeroElement = document.createElement('div');
    numeroElement.className = 'remaining-number';
    numeroElement.textContent = numero;
    remainingNumbersContainer.appendChild(numeroElement);
  });

  // Mostrar as dicas finais
  const hints=document.getElementById('final-hints');
  hints.innerHTML='';
  currentTabuleiro.dicasFinais.forEach(d=>hints.innerHTML+=`<p>${d}</p>`);

  // Atualizar o texto da regra
  document.getElementById('rule').textContent = "Descubra o código de acesso!";
}

function finishGame(){
  // Verificar se os cliques estão bloqueados
  if (isClickBlocked) {
    document.getElementById('alert').textContent = "Aguarde o desbloqueio para tentar novamente.";
    setTimeout(() => {
      document.getElementById('alert').textContent = "";
    }, 2000);
    return;
  }

  // Verificar o tempo desde o último clique
  const currentTime = Date.now();
  if (currentTime - lastClickTime < clickCooldown) {
    // Clique muito rápido, incrementar contador
    clickCount++;

    // Se exceder o limite de cliques rápidos, bloquear temporariamente
    if (clickCount >= 5) {
      isClickBlocked = true;

      // Mostrar mensagem de aviso
      showModal('Calma!', 'Você está clicando muito rápido! Pense antes de tentar. Os cliques serão bloqueados por alguns segundos.');

      // Desbloquear após 3 segundos
      setTimeout(() => {
        isClickBlocked = false;
        clickCount = 0;
        document.getElementById('alert').textContent = "Cliques desbloqueados. Pense antes de tentar!";
        setTimeout(() => {
          document.getElementById('alert').textContent = "";
        }, 2000);
      }, 3000);

      return;
    }

    // Resetar o contador após 5 segundos sem cliques rápidos
    clearTimeout(clickCountResetTimeout);
    clickCountResetTimeout = setTimeout(() => {
      clickCount = 0;
    }, 5000);
  } else {
    // Clique com intervalo adequado, resetar contador
    clickCount = 0;
  }

  // Atualizar o tempo do último clique
  lastClickTime = currentTime;

  const sInp=document.getElementById('secret'),s=parseInt(sInp.value);
  if(s===currentTabuleiro.segredo){
    // Parar o timer e armazenar o tempo final
    clearInterval(timerInterval);
    localStorage.setItem('tempoFinal', time);

    // Registrar o tempo de conclusão no banco de dados com o nome do jogador
    try {
      registerGameCompletion(time, playerName).catch(error => {
        console.error('Erro ao registrar tempo de conclusão:', error);
        // Continuar o jogo mesmo se houver erro ao registrar o tempo
      });
    } catch (error) {
      console.error('Erro ao tentar registrar tempo de conclusão:', error);
      // Continuar o jogo mesmo se houver erro ao registrar o tempo
    }

    sInp.style.transition='transform 0.5s';
    sInp.style.transform='scale(1.2)';
    setTimeout(()=>window.location.href='end.html',500);
  }else{
    // Incrementar contadores de erro
    errorCount++;
    wrongAttemptsInRow++;

    sInp.classList.add('shake');
    document.getElementById('alert').textContent="Errado! Tente novamente.";

    // Aplicar penalidades por tentativas incorretas na fase final
    if (wrongAttemptsInRow >= 2) { // Mais rigoroso na fase final
        isClickBlocked = true;
        const penaltyDuration = 4000 + (wrongAttemptsInRow - 2) * 2000; // 4s + 2s por tentativa extra

        showModal('🔒 Tentativas Excessivas!',
            `Você errou ${wrongAttemptsInRow} vezes!
            Pare de chutar e analise as dicas finais com cuidado.
            Bloqueio por ${Math.ceil(penaltyDuration/1000)} segundos.`);

        setTimeout(() => {
            isClickBlocked = false;
            showAlert("💡 Use as dicas finais para deduzir o número!", 4000);
        }, penaltyDuration);

        return;
    }

    // Verificar o número de erros e mostrar mensagens apropriadas
    if (errorCount === 1) {
      // Após o primeiro erro, mostrar modal com dica
      setTimeout(() => {
        showModal('Atenção!', 'Preste atenção nas dicas finais! Elas contêm informações importantes para descobrir o segredo.');
      }, 600);
    } else if (errorCount === 2) {
      // Após o segundo erro, dar uma dica mais específica sobre o número secreto
      setTimeout(() => {
        let mensagemDica = 'Dica: ';

        // Escolher uma dica que não esteja já nas dicas finais
        const dicasExistentes = currentTabuleiro.dicasFinais.map(d => d.toLowerCase());

        // Possíveis dicas adicionais
        const possiveisDicas = [
          currentTabuleiro.segredo % 3 === 0 ?
            'O número secreto é divisível por 3.' :
            'O número secreto não é divisível por 3.',

          currentTabuleiro.segredo % 2 === 0 ?
            'O número secreto é par.' :
            'O número secreto é ímpar.',

          currentTabuleiro.segredo < 50 ?
            'O número secreto é menor que 50.' :
            'O número secreto é maior ou igual a 50.',

          currentTabuleiro.segredo.toString().length === 1 ?
            'O número secreto tem apenas um algarismo.' :
            `O número secreto tem ${currentTabuleiro.segredo.toString().length} algarismos.`,

          sumDigits(currentTabuleiro.segredo) % 2 === 0 ?
            'A soma dos algarismos do número secreto é par.' :
            'A soma dos algarismos do número secreto é ímpar.'
        ];

        // Encontrar uma dica que não esteja nas dicas finais
        let dicaEscolhida = null;
        for (const dica of possiveisDicas) {
          let jaExiste = false;
          for (const dicaExistente of dicasExistentes) {
            if (dicaExistente.includes(dica.toLowerCase())) {
              jaExiste = true;
              break;
            }
          }

          if (!jaExiste) {
            dicaEscolhida = dica;
            break;
          }
        }

        // Se todas as dicas já existirem, escolher uma aleatória
        if (!dicaEscolhida) {
          dicaEscolhida = possiveisDicas[Math.floor(Math.random() * possiveisDicas.length)];
        }

        mensagemDica += dicaEscolhida;
        showModal('Dica!', mensagemDica);
      }, 600);
    }

    setTimeout(()=>{
      sInp.classList.remove('shake');
      document.getElementById('alert').textContent='';
    },500);
  }
}

// Função para verificar se todas as pistas têm números para marcar
function verificarTodasPistasTemNumerosParaMarcar(tabuleiro) {
  // Primeiro verificamos se o tabuleiro é solucionável
  if (!isSolucionavel(tabuleiro)) {
    return false;
  }

  // Agora verificamos se cada pista tem números para marcar
  let nums = tabuleiro.numeros.map(n => n.valor);

  for (let i = 0; i < tabuleiro.regras.length; i++) {
    const regra = tabuleiro.regras[i];

    // Verificar se a regra tem números para marcar nos números restantes
    // Se a regra é verdadeira, marcamos números que NÃO se encaixam na descrição
    // Se a regra é falsa, marcamos números que SE encaixam na descrição
    let numerosParaMarcar = [];
    if (regra.isTrue) {
      numerosParaMarcar = nums.filter(num => !regra.check(num));
    } else {
      numerosParaMarcar = nums.filter(num => regra.check(num));
    }

    // Se não há números para marcar com esta regra, o tabuleiro não é válido
    if (numerosParaMarcar.length === 0) {
      return false;
    }

    // Aplicar a regra para obter os números restantes para a próxima regra
    // Os números que sobrevivem são os que NÃO foram marcados
    nums = nums.filter(num => !numerosParaMarcar.includes(num));
  }

  // Se chegamos até aqui, todas as pistas têm números para marcar
  return true;
}

function isSolucionavel(tabuleiro){
  // Versão otimizada com menos logs e verificação antecipada
  let nums = tabuleiro.numeros.map(n => n.valor);

  // Verificar se o segredo está nos números iniciais
  if (!nums.includes(tabuleiro.segredo)) {
    return false;
  }

  // Verificar se o segredo sobrevive após aplicar todas as regras
  for (let i = 0; i < tabuleiro.regras.length; i++) {
    const regra = tabuleiro.regras[i];

    // Verificar se a regra tem números para marcar
    let numerosParaMarcar = [];
    // Se a regra é verdadeira, marcamos números que NÃO se encaixam na descrição
    // Se a regra é falsa, marcamos números que SE encaixam na descrição
    if (regra.isTrue) {
      numerosParaMarcar = nums.filter(num => !regra.check(num));
    } else {
      numerosParaMarcar = nums.filter(num => regra.check(num));
    }

    // Se não há números para marcar com esta regra, o tabuleiro não é solucionável
    if (numerosParaMarcar.length === 0) {
      return false;
    }

    // Verificar se o segredo sobrevive após aplicar esta regra
    // O segredo deve sobreviver (não ser eliminado)
    if (regra.isTrue) {
      // Se a regra é verdadeira, o segredo sobrevive se SE ENCAIXA na descrição
      if (!regra.check(tabuleiro.segredo)) {
        return false;
      }
    } else {
      // Se a regra é falsa, o segredo sobrevive se NÃO SE ENCAIXA na descrição
      if (regra.check(tabuleiro.segredo)) {
        return false;
      }
    }

    // Filtrar os números que sobrevivem (removendo os que foram marcados)
    nums = nums.filter(num => !numerosParaMarcar.includes(num));

    // Verificação antecipada: se já temos menos de 2 números, o tabuleiro não é solucionável
    if (nums.length < 2) {
      return false;
    }

    // Verificação antecipada: se o segredo não sobreviveu, o tabuleiro não é solucionável
    if (!nums.includes(tabuleiro.segredo)) {
      return false;
    }

    // Atualizar a barra de progresso (se estiver visível)
    updateLoadingProgress((i + 1) / tabuleiro.regras.length * 100, `Verificando regra ${i + 1}...`);
  }

  // Verificar se restam exatamente 2 números (incluindo o segredo)
  return nums.length === 2;
}

// Função para mostrar um modal com mensagem personalizada
function showModal(titulo, mensagem) {
  // Verificar se já existe um modal e removê-lo
  const modalExistente = document.getElementById('custom-modal');
  if (modalExistente) {
    modalExistente.remove();
  }

  // Criar o elemento do modal
  const modal = document.createElement('div');
  modal.id = 'custom-modal';
  modal.className = 'modal animate__animated animate__fadeIn';

  // Criar o conteúdo do modal
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  // Adicionar título
  const tituloElement = document.createElement('h2');
  tituloElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${titulo}`;
  modalContent.appendChild(tituloElement);

  // Adicionar mensagem
  const mensagemElement = document.createElement('p');
  mensagemElement.textContent = mensagem;
  modalContent.appendChild(mensagemElement);

  // Adicionar botão de fechar
  const botaoFechar = document.createElement('button');
  botaoFechar.className = 'btn confirm-btn';
  botaoFechar.innerHTML = '<i class="fas fa-check"></i> Entendi';
  botaoFechar.onclick = function() {
    modal.classList.remove('animate__fadeIn');
    modal.classList.add('animate__fadeOut');
    setTimeout(() => {
      modal.remove();
    }, 500);
  };
  modalContent.appendChild(botaoFechar);

  // Adicionar o conteúdo ao modal
  modal.appendChild(modalContent);

  // Adicionar o modal ao corpo do documento
  document.body.appendChild(modal);

  // Adicionar evento para fechar o modal ao clicar fora dele
  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.classList.remove('animate__fadeIn');
      modal.classList.add('animate__fadeOut');
      setTimeout(() => {
        modal.remove();
      }, 500);
    }
  });
}

// Função para mostrar alertas temporários
function showAlert(message, duration = 3000) {
    const alertElement = document.getElementById('alert');
    alertElement.textContent = message;
    alertElement.style.opacity = '1';

    setTimeout(() => {
        alertElement.textContent = "";
        alertElement.style.opacity = '0';
    }, duration);
}



// Função para mostrar um modal personalizado
function showCustomModal(content) {
  // Criar o modal
  const modal = document.createElement('div');
  modal.className = 'modal animate__animated animate__fadeIn';

  // Criar o conteúdo do modal
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.style.maxWidth = '600px';
  modalContent.style.maxHeight = '80vh';
  modalContent.style.overflow = 'auto';
  modalContent.innerHTML = content;

  // Adicionar botão de fechar
  const botaoFechar = document.createElement('button');
  botaoFechar.className = 'btn confirm-btn';
  botaoFechar.innerHTML = '<i class="fas fa-check"></i> Entendi';
  botaoFechar.onclick = function() {
    modal.classList.remove('animate__fadeIn');
    modal.classList.add('animate__fadeOut');
    setTimeout(() => {
      modal.remove();
    }, 500);
  };
  modalContent.appendChild(botaoFechar);

  // Adicionar o conteúdo ao modal
  modal.appendChild(modalContent);

  // Adicionar o modal ao corpo do documento
  document.body.appendChild(modal);

  // Adicionar evento para fechar o modal ao clicar fora dele
  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.classList.remove('animate__fadeIn');
      modal.classList.add('animate__fadeOut');
      setTimeout(() => {
        modal.remove();
      }, 500);
    }
  });
}

// ===== CONTROLES DE ÁUDIO =====

// Variáveis para controle do áudio
let backgroundMusic = null;
let isMuted = false;
let lastVolume = 50; // Volume inicial

// Função para inicializar o áudio
function initializeAudio() {
    backgroundMusic = document.getElementById('background-music');
    
    if (backgroundMusic) {
        // Configurar volume inicial
        backgroundMusic.volume = 0.5;
        
        // Tentar reproduzir automaticamente
        const playPromise = backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Música de fundo iniciada automaticamente');
            }).catch(error => {
                console.log('Autoplay bloqueado pelo navegador:', error);
                // Mostrar um indicador visual que o áudio está disponível
                showAudioNotification();
            });
        }
        
        // Configurar eventos de áudio
        backgroundMusic.addEventListener('ended', function() {
            // Reiniciar a música quando terminar (fallback caso loop não funcione)
            backgroundMusic.currentTime = 0;
            backgroundMusic.play();
        });
        
        backgroundMusic.addEventListener('error', function(e) {
            console.error('Erro ao carregar música de fundo:', e);
            // Ocultar controles se houver erro
            const audioControls = document.querySelector('.audio-controls');
            if (audioControls) {
                audioControls.style.display = 'none';
            }
        });
    }
}

// Função para mostrar notificação sobre áudio disponível
function showAudioNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--retro-cyan);
        color: var(--text-dark);
        padding: 15px 20px;
        border: 3px solid var(--text-dark);
        border-radius: 0;
        font-family: 'Press Start 2P', cursive;
        font-size: 1.2rem;
        z-index: 10000;
        cursor: pointer;
        box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
        animation: pulse 2s infinite;
    `;
    notification.innerHTML = '🎵 Clique para ativar música';
    
    notification.onclick = function() {
        if (backgroundMusic) {
            backgroundMusic.play().then(() => {
                notification.remove();
            }).catch(error => {
                console.error('Erro ao reproduzir música:', error);
            });
        }
    };
    
    document.body.appendChild(notification);
    
    // Remover automaticamente após 10 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 10000);
}

// Função para alternar mute/unmute
function toggleMute() {
    if (!backgroundMusic) return;
    
    const muteBtn = document.getElementById('mute-btn');
    const muteIcon = muteBtn.querySelector('i');
    
    if (isMuted) {
        // Desmutar
        backgroundMusic.volume = lastVolume / 100;
        backgroundMusic.muted = false;
        isMuted = false;
        
        muteBtn.classList.remove('muted');
        muteIcon.className = 'fas fa-volume-up';
        muteBtn.title = 'Mutar';
        
        // Atualizar slider
        const volumeSlider = document.getElementById('volume-slider');
        volumeSlider.value = lastVolume;
    } else {
        // Mutar
        lastVolume = backgroundMusic.volume * 100;
        backgroundMusic.volume = 0;
        backgroundMusic.muted = true;
        isMuted = true;
        
        muteBtn.classList.add('muted');
        muteIcon.className = 'fas fa-volume-mute';
        muteBtn.title = 'Desmutar';
        
        // Atualizar slider para 0
        const volumeSlider = document.getElementById('volume-slider');
        volumeSlider.value = 0;
    }
}

// Função para alterar o volume
function changeVolume(value) {
    if (!backgroundMusic) return;
    
    const volume = parseInt(value);
    const muteBtn = document.getElementById('mute-btn');
    const muteIcon = muteBtn.querySelector('i');
    
    if (volume === 0) {
        // Volume 0 = mute
        backgroundMusic.volume = 0;
        backgroundMusic.muted = true;
        isMuted = true;
        
        muteBtn.classList.add('muted');
        muteIcon.className = 'fas fa-volume-mute';
        muteBtn.title = 'Desmutar';
    } else {
        // Volume > 0
        backgroundMusic.volume = volume / 100;
        backgroundMusic.muted = false;
        isMuted = false;
        lastVolume = volume;
        
        muteBtn.classList.remove('muted');
        
        // Alterar ícone baseado no volume
        if (volume < 30) {
            muteIcon.className = 'fas fa-volume-down';
        } else if (volume < 70) {
            muteIcon.className = 'fas fa-volume-up';
        } else {
            muteIcon.className = 'fas fa-volume-up';
        }
        
        muteBtn.title = 'Mutar';
    }
}

// Função para pausar música (usada quando o jogo termina, se necessário)
function pauseMusic() {
    if (backgroundMusic && !backgroundMusic.paused) {
        backgroundMusic.pause();
    }
}

// Função para resumir música
function resumeMusic() {
    if (backgroundMusic && backgroundMusic.paused) {
        backgroundMusic.play().catch(error => {
            console.error('Erro ao resumir música:', error);
        });
    }
}

// Adicionar controle de visibilidade da página para pausar/resumir música
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Página não está visível - pausar música se preferir
        // pauseMusic();
    } else {
        // Página está visível - resumir música se preferir
        // resumeMusic();
    }
});

// Inicializar áudio quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que todos os elementos estejam carregados
    setTimeout(initializeAudio, 500);
});

