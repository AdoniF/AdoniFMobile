function dropdownPhytosocio(tmpthis) {
    dropdownPhytosociotaille(dropdownphytosocioslide(tmpthis), tmpthis);
}
function more(chiffre) {
    switch (chiffre) {
    case 9:
        return 'A';
    case 'A':
        return 'B';
    case 'B':
        return 'C';
    case 'C':
        return 'D';
    case 'D':
        return 'E';
    case 'E':
        return 'F';
    case 'F':
        return 'G';
    case 'G':
        return 'H';
    case 'H':
        return 'I';
    case 'I':
        return 'J';
    case 'J':
        return 'K';
    case 'K':
        return 'L';
    case 'L':
        return 'M';
    case 'M':
        return 'N';
    case 'N':
        return 'O';
    case 'O':
        return 'P';
    case 'P':
        return 'Q';
    case 'Q':
        return 'R';
    case 'R':
        return 'S';
    case 'S':
        return 'T';
    case 'T':
        return 'U';
    case 'U':
        return 'V'
    case 'V':
        return 'W';
    case 'W':
        return 'X';
    case 'X':
        return 'Y';
    case 'Y':
        return 'Z';
    default:
	chiffre=parseInt(chiffre)+1;
        return chiffre;
    }
}
function dropdownphytosocioslide(tmpthis) {
    var i = 0;
    var j = 0;
    var k = 0;
    var l = 0;
    var m = 0;
    var n = 0;
    var o = 0;
    var p = 0;
    var cpttmp = 0;
    while (document.getElementById(tmpthis + '.' + i) || i == 0 || document.getElementById(tmpthis + '.' + (i + 1)) || document.getElementById(tmpthis + '.' + (i + 2))) {
        try {
            if ($(document.getElementById(tmpthis + '.' + i)) .is(':visible')) {
                cpttmp++;
            }
            $(document.getElementById(tmpthis + '.' + i)) .slideToggle('fast');
            if ($(document.getElementById(tmpthis + '.' + i)) .is(':visible')) {
                cpttmp++;
            }
        } catch (err) {
        }
        while (document.getElementById(tmpthis + '.' + i + '.' + j) || j == 0 || document.getElementById(tmpthis + '.' + i + '.' + (j + 1)) || document.getElementById(tmpthis + '.' + i + '.' + (j + 2))) {
            try {
                if ($(document.getElementById(tmpthis + '.' + i + '.' + j)) .is(':visible')) {
                    cpttmp++;
                }
                $(document.getElementById(tmpthis + '.' + i + '.' + j)) .slideToggle('fast');
                if ($(document.getElementById(tmpthis + '.' + i + '.' + j)) .is(':visible')) {
                    cpttmp++;
                }
            } catch (err) {
            }
            while (document.getElementById(tmpthis + '.' + i + '.' + j + '.' + k) || k == 0 || document.getElementById(tmpthis + '.' + i + '.' + j + '.' + (k + 1)) || document.getElementById(tmpthis + '.' + i + '.' + j + '.' + (k + 2))) {
                try {
                    if ($(document.getElementById(tmpthis + '.' + i + '.' + j + '.' + k)) .is(':visible')) {
                        cpttmp++;
                    }
                    $(document.getElementById(tmpthis + '.' + i + '.' + j + '.' + k)) .slideUp('fast');
                } catch (err) {
                }
                while (document.getElementById(tmpthis + '.' + i + '.' + j + '.' + k + '.' + l) || l == 0 || document.getElementById(tmpthis + '.' + i + '.' + j + '.' + k + '.' + (l + 1)) || document.getElementById(tmpthis + '.' + i + '.' + j + '.' + k + '.' + (l + 2))) {
                    try {
                        if ($(document.getElementById(tmpthis + '.' + i + '.' + j + '.' + k + '.' + l)) .is(':visible')) {
                            cpttmp++;
                        }
                        $(document.getElementById(tmpthis + '.' + i + '.' + j + '.' + k + '.' + l)) .slideUp('fast');
                    } catch (err) {
                    }
                    while (document.getElementById(tmpthis + '.' + i + '.' + j + '.' + k + '.' + l + '.' + m) || m == 0 || document.getElementById(tmpthis + '.' + i + '.' + j + '.' + k + '.' + l + '.' + (m + 1)) || document.getElementById(tmpthis + '.' + i + '.' + j + '.' + k + '.' + l + '.' + (m + 2))) {
                        try {
                            if ($(document.getElementById(tmpthis + '.' + i + '.' + j + '.' + k + '.' + l + '.' + m)) .is(':visible')) {
                                cpttmp++;
                            }
                            $(document.getElementById(tmpthis + '.' + i + '.' + j + '.' + k + '.' + l + '.' + m)) .slideUp('fast');
                        } catch (err) {
                        }
                        while (document.getElementById(tmpthis + '.' + i + '.' + j + '.' + k + '.' + l + '.' + m + '.' + n) || n == 0 || document.getElementById(tmpthis + '.' + i + '.' + j + '.' + k + '.' + l + '.' + m + '.' + (n + 1)) || document.getElementById(tmpthis + '.' + i + '.' + j + '.' + k + '.' + l + '.' + m + '.' + (n + 2))) {
                            try {
                                if ($(document.getElementById(tmpthis + '.' + i + '.' + j + '.' + k + '.' + l + '.' + m + '.' + n)) .is(':visible')) {
                                    cpttmp++;
                                }
                                $(document.getElementById(tmpthis + '.' + i + '.' + j + '.' + k + '.' + l + '.' + m + '.' + n)) .slideUp('fast');
                            } catch (err) {
                            }
                            while (document.getElementById(tmpthis + '.' + i + '.' + j + '.' + k + '.' + l + '.' + m + '.' + n + '.' + o) || o == 0 || document.getElementById(i + '.' + j + '.' + k + '.' + l + '.' + m + '.' + n + '.' + (o + 1)) || document.getElementById(i + '.' + j + '.' + k + '.' + l + '.' + m + '.' + n + '.' + (o + 2))) {
                                try {
                                    $(document.getElementById(tmpthis + '.' + i + '.' + j + '.' + k + '.' + l + '.' + m + '.' + n + '.' + o)) .slideUp('fast');
                                } catch (err) {
                                }
                                while (document.getElementById(tmpthis + '.' + i + '.' + j + '.' + k + '.' + l + '.' + m + '.' + n + '.' + o + '.' + p) || p == 0 || document.getElementById(i + '.' + j + '.' + k + '.' + l + '.' + m + '.' + n + '.' + o + '.' + (p + 1)) || document.getElementById(i + '.' + j + '.' + k + '.' + l + '.' + m + '.' + n + '.' + o + '.' + (p + 2))) {
                                    try {
                                        $(document.getElementById(tmpthis + '.' + i + '.' + j + '.' + k + '.' + l + '.' + m + '.' + n + '.' + o + '.' + p)) .slideUp('fast');
                                    } catch (err) {
                                    }
                                    p++;
                                }
                                p = 0;
                                o++;
                            }
                            o = 0;
                            n++;
                        }
                        n = 0;
                        m++;
                    }
                    m = 0;
                    l++;
                }
                l = 0;
                k++;
            }
            k = 0;
            j++;
        }
        j = 0;
        i++;
    }
    return cpttmp;
}
function dropdownPhytosociotaille(ctptmp, tmpthis) {
   			document.getElementById('ecologie').value=document.getElementById(tmpthis).innerHTML.replace(tmpthis,"").replace("&nbsp;"," ").trim();
    if (parseInt(ctptmp) == 0) {
        if (document.getElementById('SELECTHABITAT') .style.height === '40px') {
            document.getElementById('SELECTHABITAT') .style.height = '300px';
            document.getElementById('SELECTHABITAT') .scrollTop = (parseInt(tmpthis.offsetTop) - 150);
        } else {
			document.getElementById('SELECTHABITAT') .style.height = '40px';
			document.getElementById('SELECTHABITAT') .scrollTop = document.getElementById(tmpthis).offsetTop;
		
            
        }
    }
}

