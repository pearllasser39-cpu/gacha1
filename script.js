// ================= CANVAS =================
const c = document.getElementById("cv"), ctx = c.getContext("2d");
function resize(){ c.width=innerWidth; c.height=innerHeight; ctx.font="14px sans-serif"; }
resize(); window.onresize=resize;

// ================= UI =================
const coins = document.getElementById("coins");
const dia = document.getElementById("dia");
const questTab = document.getElementById("questTab");
const overlay = document.getElementById("overlay");
const page = document.getElementById("page");
const inv = document.getElementById("inv");
const build = document.getElementById("build");
const gacha = document.getElementById("gacha");
const villagerUI = document.getElementById("villagerUI");

// ================= GAME STATE =================
const game = {
  coins:100,
  diamonds:5,
  res:{grass:0,wood:0,mud:0},
  // villagers now include patrol ranges and simple AI data
  villagers:[
    {name:"Aiko",age:23,gender:"F",x:320,origX:320,work:null,vx:0,dir:1,minX:220,maxX:420},
    {name:"Haru",age:25,gender:"M",x:380,origX:380,work:null,vx:0,dir:-1,minX:300,maxX:480}
  ],
  inventory:Array(25).fill(null),
  quests:[{name:"Save the Babies", req:{grass:10,wood:5,mud:3}}],
  hut:{ state:"broken", req:{grass:10, wood:5, mud:3} }
};

// ================= REFRESH UI =================
function refreshUI(){ coins.textContent=game.coins; dia.textContent=game.diamonds; }
refreshUI();

// ================= IMAGES (same as before) =================
const hut = new Image(); let hutReady=false;
hut.onload=()=>{ hutReady=true; console.log("HUT LOADED"); };
hut.onerror=()=>console.error("HUT FAILED TO LOAD");
hut.src = "data:image/png;base64,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";

const house = new Image(); house.onload = ()=> console.log("HOUSE LOADED"); house.onerror = ()=> console.warn("HOUSE FAILED");
house.src = "data:image/png;base64,iVBORw0KGdata:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABwCAYAAADWrHjSAAABN2lDQ1BBZG9iZSBSR0IgKDE5OTgpAAAokZWPv0rDUBSHvxtFxaFWCOLgcCdRUGzVwYxJW4ogWKtDkq1JQ5ViEm6uf/oQjm4dXNx9AidHwUHxCXwDxamDQ4QMBYvf9J3fORzOAaNi152GUYbzWKt205Gu58vZF2aYAoBOmKV2q3UAECdxxBjf7wiA10277jTG+38yH6ZKAyNguxtlIYgK0L/SqQYxBMygn2oQD4CpTto1EE9AqZf7G1AKcv8ASsr1fBBfgNlzPR+MOcAMcl8BTB1da4Bakg7UWe9Uy6plWdLuJkEkjweZjs4zuR+HiUoT1dFRF8jvA2AxH2w3HblWtay99X/+PRHX82Vun0cIQCw9F1lBeKEuf1UYO5PrYsdwGQ7vYXpUZLs3cLcBC7dFtlqF8hY8Dn8AwMZP/fNTP8gAAAAJcEhZcwAACxMAAAsTAQCanBgAAAbVaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0NSA3OS4xNjM0OTksIDIwMTgvMDgvMTMtMTY6NDA6MjIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjItMDQtMTFUMTE6MTA6MDktMDM6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMDQtMTFUMTE6MTA6MDktMDM6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIyLTA0LTExVDExOjEwOjA5LTAzOjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNkOGUzNjNmLTU1NzMtMjM0Zi05ZjMzLTJlZDIzZjAyZDAwNCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmVjMGZkZTM2LWYwZTctNWI0My04OTdmLWY4MDY0NDJlNDhhMyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjA4OGJhZTYzLTdkNmMtYTM0My05OGQ2LTI4NjllMzExYzNhMSIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IkFkb2JlIFJHQiAoMTk5OCkiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowODhiYWU2My03ZDZjLWEzNDMtOThkNi0yODY5ZTMxMWMzYTEiIHN0RXZ0OndoZW49IjIwMjItMDQtMTFUMTE6MTA6MDktMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6M2Q4ZTM2M2YtNTU3My0yMzRmLTlmMzMtMmVkMjNmMDJkMDA0IiBzdEV2dDp3aGVuPSIyMDIyLTA0LTExVDExOjEwOjA5LTAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDxwaG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDxyZGY6QmFnPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDoyNWI0YWQ3MC0wNjUxLTI3NGEtODY5Zi0zYTMwNTBkMmE3MzY8L3JkZjpsaT4gPHJkZjpsaT54bXAuZGlkOjYwZGRmMWZmLWQwYTMtYmQ0Mi05OWU0LThmZGJiZTBkYzQ5OTwvcmRmOmxpPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnwNclYAABLISURBVHic7V1NbBvH2X5kKrIEGzEDtyHjsA1dqSprKQJdpY7yAxRfDk0tQAlRFIVPhXKxnFsbtEB78SGHAk2NAD3ZCQpUwHcxgg8tE6FygOBrgCKtWSOGWdc0FoxcsY7iUi6M0EYMK3JZ9bB8lzOzM7MzyyWpHz6AIHJ2dufdfd95f2eWfRsbG+hh52JXtwnoobvo++uPjgAAVpbq0g4LpfWOETM4OmykjtbK1/qiGG9mbAAAMP3Oh1Fcbkuiv9sEEAZHhzfS6bhR3wqGN6ISgp2OftXM7yaSyUFpe7W61mFKtj82nQ+gYn7QsR7CYdOYABaymd5jfnvgE4BOOn0MPOdPpebF9pmxgY2F0nrPD2gRXTcBM2MDG+SN2yA1EsPLLw61lMRYKK13S+A3DfoBPgya7uDgiy88sZEaiSlDUACoVGpQRQfx0TpefnFoY+L1v/Q0QUh0TQMsvvDExrihtFUqNeWxvbkjuPzKk710Zkh0RQBsmG+CnhCER8cFQMd82Uw3TQ71hCAcOioAKuYHOWIyIZD5DT0hsEfHBEDG/FrZdQDFKEBn8wmpkRhq5ZivvScEduiIAOiYnxrxM1E242WJoPhoHZ/lL/jae0JgjrYLwOILT/gYQcyXmQOT2c9ib+6IVAgA9ITAAG0VAIrzWeiYr4OuEKQSgvhovScEAWibAOjUfpQhIEElBD1zoEdbBMCW+RQFqEI+mf1XRQE9IbBD5AKgCvVkzJdFAaZxP0UB/VfPc+09IbBDpOVgXZJHFwWEXZQSH62jVo4hjvP496GnvPYgIdiOtYPLrzwZ6rzINICN2rfxBYLWAezNHVFqgl6eIBiRaIComZ9MDlot/9qbO4Ja/oJSE+zNHfH1D9IELw9PGI/PnffiUKjzuoWWBaBdM98W7RCCrYJW1nW2ZAKiYn5QLUCmDVRRwE5zDFtd1BtaA0TBfDYKeO9+s51luMoUuFEApDPeRhMA2JKaYGWpHslqplACECXzZVGAqQ+giwJshIAyhptFCE6/fa9jY1mbAB3zRQS1y8wB6/WbrARWqX0aR9a+Xc1BGFgJgE1VL6g96hVBMmaThpC1bzYhOP32Pe+vkzA2AUFqv1a2azcFaYEgk6BT+zpzIENDCCIxB51mqC2MNECUNj8oCjCN/22jAFW7DLTa2IgQCV3s32ZHoADY1vNt2lUrgmQQ/QFdLUCVAbRtb3XfwVaAVgDC1PPD1AJEmGoBlY1XzWxdu8ocbHcoBaCdat80HWyCMGrfJlkUFltl15FUAMKEet1MB0clBFFgqzCe4IsCdPV8MWnTLuaH2QkcJgqo5S8AZf+sr5VjXvt29gMmXv9LHycAMoePYBrShY0CBkf1xIp+wcpSHXHhHBWzaXyxnYSa9Q1kmUKxzaTPZm9zTp3HBIC+389MYvqdD7mNmsQkkWli+jYqXwAA3rv/JW41kKgFqtU1L0VcqdTw0tdvAHAdQZHZn+UvcO30vVaOIT5ax+/++njvfQNwn+kuwH4NX5TMl0UBOoJZ6KIAmxBxJ6MfgPXq3ShrAaxZYUEznj4D8iKRidoHmkxfWaqjcr8GIC4f2AIsPTJaZej0e45YOlgtCrh7MPqjmuEqB9HUcWQJJgJNH5ZKCEhDyKDbiErHghao6srWJrTbboJh6RHfmyBei47J6GL7GtUCTNR7VLUAUUoJQSVim5x/sVpFNpn0XUN8iLYMajds6DOhvVitNgXAdsa2OwoIctKCogBW7bPtqZEYfoL7+OXHVe31dwr6AfsZ245awHv3m2qNtf8E1m4BwSuCRHhCMFoH4AoBgXVEVQUc2z6bvd/KUh3T73zY118rx3D67Xv42U/4gkzYZE7YfQEXS59gcuxRRnXFuf6sSrtY+gQvfb0v1L4AEoL4KHBlEb48QMoTEp5W2z6bvV+q8XyUbwptp9pXaRzWNqtsWLHKq+6wGcC9uSPAojwVLEYTsmyhSZ+t0G8X3IUPvsUP3aoFFKtVH5N17UD3Cz9bGVwUEDbUa0chSMVsFcJoApxyBYMXEHnYaN9ns/dz+/QDwOlrl3H5lSetkjbtYj6ZAFEAVO0sbIWApY2F7IGG6bMl+tEH1jEitDsEpHa3fMp7/bI4nYUrrOZLwmk8WTvrMNXK8gdl22ez96Pj/QBw/Uzry75aYz4P1SwXhcJWCFRRAycQZbkHbd1ns/drOIX949OwYj4QXS3AhvnisYXSOmbGBpRCQOPohEOFnRYF+BBFVS+oXWT+2DPDqN+qG/2NPTMMoLmaeGVJvf6/VxXUwxcFAK1X9YLafTP/yBgA4KfZ/xgRvUDnXCgFagJdZrAXBcBfC6AHKrZHFQKqmD9z9yPjtQEzSx9hYc9XtUIg1gJkcX/mx0/BOcX3BXZgFKBiTpiqnq49iPkyxwXwe7lALFAIRKgcQxKC8WnXbn6Wv7CzogAT5pu0E1TtOuazAkbMESVYbB+fBrCoFgKZNtEJwZVT5zHe0Bw7KgpQeeNRhoBBzCdcWYSQn683xuTbUyPu/yAhsAkRUyMxXFmsIzXS/ihApp5b6Wc6rgzKBSG2IWBY5v/7ENlh8310K0t1rCy5M3cc562FgOgT28en4QqBZFWt6EDJfAoZwzph22VtwfQJTiBhZmygfUmeBvOnprLA/3/km/GmTiA5o86p5rlTU1kUCkVjIVAlhcgn4EuqPDNUFVTR95D5I3bntm+MlaU6JtAQAN3mzLYwH+CiCmL86X9+BQDgOBUpLZlMGgDw8sjfvZug8/8FeyFQrSBiowP3XP8DFe+vOQ4PWZvpuSb9FkrrmIGff6ZjePsCKB18ZbGp5tvB/Ew2A6foAAAO/+O3APyMV9UBKBPoCcIjriBceuy7bnvj2oVC0T3hQsm7eQBepFErx3z7BgD/HgPSMGJorNr6RX1kx3XH2OOdGmOhtI7T1y739f1+ZhJsOpgEgE3+sIwOag9iPoGEgJjlOJXAAhChWK16QkAaRby2TggAP7PFzSTUJrsn58E9Uroyd+4G0m56bifGANCnrQXYLvU2ZT7AM2x+Pu9jvqocTJ+LTgWzsznfddlrq8yBTYjI3od3fd/Z5jA9tx1jkIZdXV1781tD9TlAEQVEmd6VMV8FWsueLzio3+LtVRFV5Kbc65gseQ4SApsQUeWTbAdIawELpXWMT/vTwWFtvgpO0cH8fN5jLCBnPgDUb9WRLzjITWWQTseRTscxP59XagEgnBDQfbGOIWmfdDre1b0CrFY0MZfshCLkpjJ44+2i911aCxARJr1rOvN1NzI59igAdxWw7bmEMEIg7ihid+CYvs4+alQqNe5+dbuERIgTjIW2FkCwTe/aqH0ZJscexcXSJxzjJ8cetV4nSAhrDig6EB/aZoD4LMI+m9C1AFtvH3AZkcnIj4mg2W8C7pqO4xuT/R8kBKpSKkUdWw2lP13zPsf2x7C6uvYme9yqFhDW21cxOncsBwAovlvwVNiJXBZn8kVpVHAil+V2CGW/M+VdQwZV5KETAh0o5JRdm4Xsfqk/+T1BmJ3NBfYJAoXCsf3q+5JGAbp0cBi1z2kER69Oq9U1TwhYsMxnIbuejjlhQkRCoVDE7IljWvppDKfo+OiQOb0APOeWBTm4Jvckw/yZswBc5meTSaTTcakpk6aCI5n5DbXsOA6nogks49big5wjQ0LAgmV+pVLDWpxfRawag6XD62uiCRTVM1PomE/aizAr0F58t4DcVCYwytFh9sQxTwh06AfQJzJ2fHrASw6FnfkqxnN9GqqScvjsvnzZbKfja/FBTx3LZpqMFhHBQuDH1FTWozmsk0vMZ83A7GzO9734biHU9QG/CUqn48rd1tr3A7Qc5zcevErts+dmshlPYlVeNzliMjWsGkNncnRCQFgorQMPPuC/roHgqeClqTXH5ewKhs6xlkEpACrmOw/uQQZmoZ5IjMohpHbWyWJrA5T7F2e97lpimwoqIZDB1AfQoVitIhNPG/ULA/ZeWUFTvVxDKgAq5pfuDyKGcMzvJoJmqygEjlPxspGx/THs2uXORzIBreQ4sskk1uD38tnvhYIbBYUVAsD//JUmYPqdDyHmeQ4dONyIFWP4Qv8Dx8WTpDZfjPcNIgLxXDE8Yh+A41S8nPzsbE7LCFW7LD8g++44FS8PQTSUy1WUy+/ia4eG5QWoICe0MXY6HYdTWws0A+l0nLv/IEfaR082443h+k5x7vjpa5cBGLwjiMIIQrFaDZzdtrOfGE+eP6mrfMHxtbH9W4mVw2ioRGI/ardqPhOUyWa0Ti/LqHzBQSaT5gpMsu8m2cdMpjmuKAzGGkA3wNBQ7LgYn6bTcdQCYnkbEJMLhaa0614SRZEAhUkifVGAvSbFz2QGRATlOMQ2MgFBEE2AbrYHMV8HpQBcvXFpbnL4iePtrH5Rdg/wh340rvhaM/Z4biqDfMExXkjSKvbtewB9/Xt86WURshlJIBMg2nzxu8oEyK7LxvuzJ47xPg30BSypAFy9cWmOJVgsJwL+d+mxTCLC2ZkkMpFlvvgCKFNQhUz22jf2pol+WTWNvQ/dfQLgohCCGHWQOZDh6NHDwKfuT8iIPoDMJzh69LD3mb2mOMMpj8LmKUwR6AOIaUqTd9Xp+otgZ3g6HcdrZ9/njr9W+Sf3fTT9iNGMZ68pY6bsPsSyaaueuAxf/MYBfNGw78ryp8bXnT1xLJRf07exIX9B+KEDh98AgERi0BcFRAVKiwLAW4VLVud+f8qdHVEzSAbW/v/89R9i/sxZ43wAG604RQerq/8wHjeReMw45JTRNH/mLByngtxUBsnkIM7ki141kLS8VAMQ8wF3/djQUOz4nvvNneRjzwxzg5lIHrcGsEEY5f/FWW+CtwqXPG3AJopUpWhTugC+hHr3gf8g3qg7JBL78atf/C+ef/6bxkko8XjhTDGQJsK3nn9em0xjP+vUvywMJBj/bByVFMXlWjblTZk0i6p4IrXb+3x55XNlG+BfESQy35Yub18BmBLqneaW9dXVW0gk9gdeE/DbdBrDJpPIrm5ms6RRwlgAvLQsmNAkRHmTZZLnqBXcfypGX1753Ds2kdrtHaPzyQyw8XkYuih5wuY+/njnY67/6uotH3OJOaw3Tm2FQjF05lCW1mXHJsdPbLeB1AdgTQDg5gN+8O3HUanUOHWrKm+KoAUf+YKD2dkcCoWil/goN5w8YvBkYh9+c/EmXj06wl3j5LklvDT5MC6u3gbQFJDR9CMAwNUKwtJFBSmqQ6TTcfz63N985/UP+YtDmxVs1by2Bnx+e+1NAHNXb7g+l7EGSCYHUan421spb2aTSWSTSc8BnEzsAwC8enQEJ88tcX1fPTqC5Zt3uDadIxhF2TWZHMRADLh3r84to6qvb/4fhCQ05guLOfZL6J+PZxFlefPi6m385uJNX/vJc0uYSO3GZGKfpwU6SZeAueAuWwPWvx4uwjQM60S4FmY8Lt26iSqY7QSpfyBAA1y9cWlO9AdEdKq8aYuo6WKfBfsAtzq0tYAg5gPhy5vUBsCLAgDXuVP5ACfPLWEy4T9fxsAwdLElVBGHDhx+w/SZbCUoawGmN9pKeTNfcLwogPDS5MM4eW5JGQWweO3s+14UEAVdQSaAhEDbaYshMBMYhLDlTWpjowBy7kgIWEykduPgww9ykYAuCghDl04DELabEBhHAao1ZWHLmzI0kz+3uZifwkMxDNQhCro6/RNv3UBLeYBWypsyyGw/MR+ATwOoEBVdO+HXRVvOA7RS3pyactOtbzWcwP/728eYSO3G9x7/EpZv3uGY30m6dhJCm4BMNgMUgZVl+/ImzULxmrYMF6MAL3ceki4RPROgAXnMyxazJ5F4jPO0ZVEA4GoCmepfvnmHywLKooAo6NpJCB0GUiVKVqZU1azpPIIsCphM7Gs4g7c9IWAFgk0Fi1HA/JmzHj3iG8mCavUibSpspwgA0GuAOQCeEMjieJOyKNuHBEb3oNkZzlf+7PP/rZROZb9Stt2YDwSbAE4ICIViRdpZ1S47Lmzu5er/Jt9txzbtA/hpA7Yn8wHNmkAWUac/E4nB42OZZ1FyPgAAjGWexdPPDWBl+VNcX3bfcfflg8132qUOPgQA+PMfhK1qzPkl5wPf2y+iwnZk/v8cfgrZZNLYCYzqAXiC5DL4WQDwmE/tLsObbaxgEJ5+bsA7/8sH76LEW6jIGLadCj8iuF8P7xA8k3J9eY83y1eW73IMvr683mBwc/anDqLRl7z7AZ/WYMboIQDvX2r8XI5J56hmwaEDfMYtdfAhbuaz6n9lWf9KVDovdfAhXF/2b+fezjM3Shj5AFGiIQRvkB9AM902G8f6BYz9nwN6zLdBp02AD+TYPf3cQ6HO66E1dFwDAH4t0Ap6s781dFMDzK2urgH4oKWtZyzze7BHVzQAwDmEreYYPOb3Zr89/gurEzMR9dL+/gAAAABJRU5ErkJggg==";


const groundImg = new Image(); let groundReady = false; groundImg.onload = ()=> { groundReady = true; console.log("GROUND READY"); }; groundImg.onerror = ()=> console.warn("GROUND FAILED"); groundImg.src = "PUT_PREVIEW_2_DATA_URI_OR_PATH_HERE";
const forestImg = new Image(); let forestReady = false; forestImg.onload = ()=> { forestReady = true; console.log("FOREST READY"); initForest(); }; forestImg.onerror = ()=> console.warn("FOREST FAILED"); forestImg.src = "PUT_PREVIEW_4_DATA_URI_OR_PATH_HERE";

// ================= FOREST GENERATION (unchanged) =================
let forestNodes = [];
function seededRandom(seed){ return function(){ seed = (seed * 1664525 + 1013904223) >>> 0; return (seed & 0xfffffff) / 0x10000000; }; }
function initForest(){ const rand = seededRandom(12345); forestNodes = []; const layers = [ {count: 32, scaleMin: 0.36, scaleMax: 0.6, yBias: 0.50, alpha:0.52}, {count: 28, scaleMin: 0.55, scaleMax: 0.95, yBias: 0.64, alpha:0.78}, {count: 18, scaleMin: 0.95, scaleMax: 1.45, yBias: 0.78, alpha:1.0} ];
 for(let li=0; li<layers.length; li++){ const L = layers[li]; for(let i=0;i<L.count;i++){ const x = Math.floor(rand()*1.8*c.width) - 0.4*c.width; const y = Math.floor((L.yBias + rand()*0.14) * c.height); const s = L.scaleMin + rand()*(L.scaleMax - L.scaleMin); const flip = rand() > 0.5; const r = rand(); let type = "tree"; if(r>0.88) type="rock"; else if(r>0.72) type="bush"; else if(r>0.60) type="flower"; forestNodes.push({layer:li, x,y, s, alpha:L.alpha, flip, type, seed: Math.floor(rand()*0xffffffff)}); } }
 for(let i=0;i<36;i++){ const x = Math.floor(Math.random()*c.width); const y = Math.floor(c.height*0.78 + Math.random()*c.height*0.15); forestNodes.push({layer:3, x,y, s:0.6+Math.random()*1.2, alpha:1, flip:false, type:"grass", seed:Math.floor(Math.random()*0xffffffff)}); }
}
initForest();

// ================= PROCEDURAL ASSET DRAWERS (unchanged) =================
function drawTree(ctx,x,y,scale,seed,alpha,flip){ const rand = seededRandom(seed); ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x,y); if(flip) ctx.scale(-1,1);
 const trunkW = 8*scale + rand()*6*scale; const trunkH = 28*scale + rand()*20*scale; ctx.fillStyle = "#6a4527"; ctx.beginPath(); ctx.roundRect(-trunkW/2, -trunkH, trunkW, trunkH, 3*scale); ctx.fill(); ctx.fillStyle = "rgba(0,0,0,0.12)"; ctx.beginPath(); ctx.ellipse(0, 2, trunkW*1.6, trunkW*0.8, 0, 0, Math.PI*2); ctx.fill(); const canopyCount = 3 + Math.floor(rand()*3); for(let i=0;i<canopyCount;i++){ const cx = (rand()-0.5)*24*scale; const cy = -trunkH - (rand()*18*scale); const rx = 22*scale + rand()*18*scale; const ry = 16*scale + rand()*12*scale; const g = ctx.createRadialGradient(cx,cy,Math.max(4*scale,rx*0.1), cx,cy,Math.max(rx,ry)); const hue = 100 + Math.floor(rand()*30); g.addColorStop(0, `hsl(${hue} 72% ${40 + rand()*10}%)`); g.addColorStop(1, `hsl(${hue-15} 40% ${18 + rand()*6}%)`); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, (rand()-0.5)*0.6, 0, Math.PI*2); ctx.fill(); } for(let i=0;i<6;i++){ const lx = (rand()-0.5)*30*scale; const ly = -trunkH - (rand()*28*scale); ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.beginPath(); ctx.ellipse(lx, ly, 6*scale, 3*scale, (rand()-0.5)*0.8, 0, Math.PI*2); ctx.fill(); } ctx.restore(); }
function drawBush(ctx,x,y,scale,seed,alpha){ const rand = seededRandom(seed); ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x,y); const baseColor = 110 + Math.floor(rand()*40); for(let i=0;i<4;i++){ const cx = (rand()-0.5)*22*scale; const cy = - (rand()*10*scale); const r = 18*scale + rand()*12*scale; const g = ctx.createRadialGradient(cx,cy,1,cx,cy,r); g.addColorStop(0, `hsl(${baseColor} 65% ${42 - i*3}%)`); g.addColorStop(1, `hsl(${baseColor-20} 35% ${18 - i*2}%)`); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx,cy,r,r*0.7, (rand()-0.5)*0.4, 0, Math.PI*2); ctx.fill(); } ctx.fillStyle = "rgba(0,0,0,0.1)"; ctx.beginPath(); ctx.ellipse(0,2,20*scale,8*scale,0,0,Math.PI*2); ctx.fill(); ctx.restore(); }
function drawRock(ctx,x,y,scale,seed,alpha){ const rand = seededRandom(seed); ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x,y); const w = 18*scale + rand()*22*scale; const h = 12*scale + rand()*10*scale; ctx.fillStyle = "#bfbfbf"; ctx.beginPath(); ctx.moveTo(-w*0.45, -h*0.2); ctx.lineTo(-w*0.15, -h*0.9); ctx.lineTo(w*0.3, -h*0.6); ctx.lineTo(w*0.5, -h*0.1); ctx.lineTo(w*0.2, h*0.5); ctx.lineTo(-w*0.4, h*0.2); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "rgba(0,0,0,0.12)"; ctx.lineWidth = 1; ctx.stroke(); ctx.restore(); }
function drawFlowers(ctx,x,y,scale,seed,alpha){ const rand = seededRandom(seed); ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x,y); const count = 6 + Math.floor(rand()*8); for(let i=0;i<count;i++){ const fx = (rand()-0.5)*28*scale; const fy = -(rand()*10*scale); ctx.fillStyle = `hsl(${Math.floor(20+rand()*300)} 80% ${55 - rand()*10}%)`; ctx.beginPath(); ctx.ellipse(fx,fy,3*scale,2*scale,0,0,Math.PI*2); ctx.fill(); ctx.fillStyle = "#2a2a2a22"; ctx.fillRect(fx-0.5, fy, 1, 6*scale); } ctx.restore(); }
function drawGrassCluster(ctx,x,y,scale,seed,alpha){ const rand = seededRandom(seed); ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x,y); const blades = 14 + Math.floor(rand()*18); for(let i=0;i<blades;i++){ const bx = (i-blades/2)*(1.6*scale); const h = 8*scale + rand()*18*scale; ctx.strokeStyle = `hsl(${100 + rand()*30} 60% ${20 + rand()*20}%)`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx, 0); ctx.quadraticCurveTo(bx + 2*scale, -h*0.5, bx + (rand()-0.5)*4*scale, -h); ctx.stroke(); } ctx.restore(); }

function drawWell(ctx, cx, groundTop){ const wellW = 96; const wellH = 52; const rimH = 10; const x = Math.round(cx - wellW/2); const y = Math.round(groundTop - wellH); ctx.save(); ctx.fillStyle = "#8b6b4b"; ctx.fillRect(x, y, wellW, rimH); ctx.fillStyle = "#c9b29a"; ctx.fillRect(x, y + rimH, wellW, wellH - rimH); ctx.strokeStyle = "rgba(0,0,0,0.08)"; ctx.lineWidth = 1; for(let i=0;i<6;i++){ const sx = x + 6 + i * (wellW - 12) / 5; ctx.beginPath(); ctx.moveTo(sx, y + rimH + 4); ctx.lineTo(sx, y + wellH - 6); ctx.stroke(); } ctx.fillStyle = "rgba(0,0,0,0.08)"; ctx.beginPath(); ctx.ellipse(cx, groundTop + 6, wellW*0.45, 8, 0, 0, Math.PI*2); ctx.fill(); ctx.restore(); }

// ================= CAMERA + PARALLAX + VILLAGER MOVEMENT =================
// cameraX is a world-space offset; targetCameraX follows the mouse but smoothed
let cameraX = 0; let targetCameraX = 0; let lastMouseX = c.width/2;
// mouse/touch support
c.addEventListener('mousemove', (e)=>{ lastMouseX = e.clientX; targetCameraX = (lastMouseX - c.width/2); });
c.addEventListener('touchmove', (e)=>{ if(e.touches && e.touches[0]){ lastMouseX = e.touches[0].clientX; targetCameraX = (lastMouseX - c.width/2); } });

// simple villager AI: patrol within minX..maxX and slowly wander
function updateVillagers(dt){
  for(let v of game.villagers){
    // wandering: small random jitter and patrol
    if(!v.vx) v.vx = (Math.random()*0.6 - 0.3);
    v.vx += (Math.random()-0.5) * 0.02; // gentle randomness
    // nudge towards patrol direction
    if(v.x < v.minX) v.dir = 1; if(v.x > v.maxX) v.dir = -1;
    v.vx += v.dir * 0.02;
    // clamp speed
    v.vx = Math.max(-0.9, Math.min(0.9, v.vx));
    v.x += v.vx * (dt/16); // scale movement by frame delta
    // occasionally flip direction
    if(Math.random() < 0.002) v.dir *= -1;
  }
}

let lastFrame = performance.now();

// ================= DRAW (main) =================
function draw(){
  const now = performance.now();
  const dt = Math.min(40, now - lastFrame); // cap dt to avoid huge jumps
  lastFrame = now;

  // smooth camera towards target
  const camSpeed = 0.08; // adjust smoothing
  cameraX += (targetCameraX - cameraX) * camSpeed;

  // update villagers with dt
  updateVillagers(dt);

  ctx.clearRect(0,0,c.width,c.height);
  // sky
  const sky = ctx.createLinearGradient(0,0,0,c.height*0.7);
  sky.addColorStop(0,"#9be1ff"); sky.addColorStop(1,"#7ec8ff"); ctx.fillStyle = sky; ctx.fillRect(0,0,c.width,c.height);

  const groundTop = Math.round(c.height*0.6);
  if(groundReady){ const tileW = Math.max(64, Math.round(c.width * 0.25)); const tileH = Math.round(tileW * (groundImg.height/groundImg.width || 0.5)); for(let gx = -tileW; gx < c.width + tileW; gx += tileW){ for(let gy = groundTop - tileH; gy < c.height + tileH; gy += tileH){ ctx.drawImage(groundImg, gx, gy, tileW, tileH); } } } else { ctx.fillStyle="#6fc26a"; ctx.fillRect(0,groundTop,c.width,c.height-groundTop); ctx.fillStyle="rgba(0,0,0,0.03)"; for(let i=0;i<10;i++){ ctx.fillRect(0, groundTop + i*(c.height-groundTop)/10, c.width, 2); } }

  // fog
  const fog = ctx.createLinearGradient(0, groundTop*0.2, 0, groundTop);
  fog.addColorStop(0, "rgba(255,255,255,0.0)"); fog.addColorStop(1, "rgba(255,255,255,0.25)"); ctx.fillStyle = fog; ctx.fillRect(0,0,c.width, groundTop);

  // draw forest with parallax using cameraX (world-space offset)
  const parallaxFactor = cameraX / (c.width*0.5); // normalized -1..1
  forestNodes.sort((a,b)=>{ if(a.layer!==b.layer) return a.layer - b.layer; return a.y - b.y; });
  for(const node of forestNodes){
    const par = 1 + (node.layer||0)*0.12;
    // nodes have world x; convert to screen x by subtracting cameraX scaled by depth
    const depthMult = 0.25 + (node.layer||0)*0.5; // deeper layers move less
    const ox = Math.round(node.x - cameraX * depthMult + parallaxFactor * 40 * (node.layer||0));
    const oy = node.y;
    const a = node.alpha || 1;
    if(forestReady && node.type==="tree"){ ctx.save(); ctx.globalAlpha = a; const iw = forestImg.width || 128, ih = forestImg.height || 128; const dw = Math.round(iw * node.s); const dh = Math.round(ih * node.s); const dx = Math.round(ox - dw/2); const dy = Math.round(oy - dh + 8); if(node.flip){ ctx.translate(dx+dw/2,0); ctx.scale(-1,1); ctx.drawImage(forestImg, -dw/2, dy, dw, dh); } else { ctx.drawImage(forestImg, dx, dy, dw, dh); } ctx.restore(); continue; }
    switch(node.type){ case "tree": drawTree(ctx, ox, oy, node.s, node.seed, a, node.flip); break; case "bush": drawBush(ctx, ox, oy, node.s*0.9, node.seed, a); break; case "rock": drawRock(ctx, ox, oy, node.s*0.9, node.seed, a); break; case "flower": drawFlowers(ctx, ox, oy, node.s*0.9, node.seed, a); break; case "grass": drawGrassCluster(ctx, ox, oy, node.s*0.6, node.seed, a); break; default: drawTree(ctx, ox, oy, node.s, node.seed, a, node.flip); break; }
  }

  // well in world-space center (we subtract cameraX to put world center correctly)
  const worldCenterX = c.width*0.5 + cameraX*0.05; // slight offset so camera feels angled
  drawWell(ctx, worldCenterX, groundTop);

  // Hut placement uses world coords -> adjust by camera for small parallax
  const w = 180, h = 160; const hutWorldX = c.width * 0.62; const hutScreenX = hutWorldX - cameraX*0.08; if(hutReady){ ctx.save(); const iw = hut.width || 1, ih = hut.height || 1; const scale = Math.min(w/iw, h/ih); const dw = Math.round(iw * scale), dh = Math.round(ih * scale); const dx = Math.round(hutScreenX - dw/2); const dy = Math.round(groundTop - dh); if(game.hut.state === "broken"){ ctx.globalAlpha = 0.65; ctx.filter = "grayscale(60%)"; } else { ctx.globalAlpha = 1; ctx.filter = "none"; } ctx.drawImage(hut, dx, dy + 50, dw, dh); ctx.restore(); if(game.hut.state === "broken"){ ctx.fillStyle = "red"; ctx.font = "bold 14px sans-serif"; ctx.fillText("BROKEN", dx + Math.round(dw/2) - 30, dy - 8); } } else { ctx.fillStyle = "#000"; ctx.fillText("HUT LOADING...", hutWorldX - 80, groundTop - h - 10); }

  // foreground shadow
  ctx.fillStyle = "rgba(0,0,0,0.04)"; ctx.fillRect(0, groundTop, c.width, 8);

  // draw villagers: use world x minus cameraX scaled by foreground depth to compute screen x
  for(let v of game.villagers){
    const depth = 0.9; // villagers are in foreground so move almost with camera but a bit less
    const screenX = Math.round(v.x - cameraX*depth);
    const yv = groundTop - 8 + Math.sin(performance.now()/600 + v.origX/100)*6; // little bobbing
    // body
    ctx.save();
    // simple flip based on vx
    if(v.vx < -0.02) ctx.scale(-1,1);
    ctx.fillStyle="#ffe0c2"; ctx.beginPath(); ctx.arc(screenX,yv-16,10,0,6.28); ctx.fill();
    ctx.fillStyle="#f6b"; ctx.fillRect(screenX-7,yv-8,14,18);
    ctx.restore();
    // draw name above when hovered is handled separately
  }
}

// click/hover handling uses transformed screen->world mapping where necessary
c.addEventListener('click', (e)=>{
  const rect = c.getBoundingClientRect(); const mx = e.clientX - rect.left; const my = e.clientY - rect.top;
  if (overlay.style.display === "block") { overlay.style.display = "none"; return; }
  const groundTop = Math.round(c.height * 0.6);
  const w = 180, h = 160; const hutWorldX = c.width * 0.62; const hutScreenX = hutWorldX - cameraX*0.08; const hutX = Math.round(hutScreenX - w/2); const hutY = groundTop - h;
  if (mx >= hutX && mx <= hutX + w && my >= hutY && my <= hutY + h) { openRepairMenu(); }
});

// hover villager info: detect using screen coords computed same as in draw()
c.addEventListener('mousemove', (e)=>{
  const mx=e.clientX, my=e.clientY; let hit=null;
  for(let v of game.villagers){ const screenX = Math.round(v.x - cameraX*0.9); const screenY = Math.round(c.height*0.6-16 + Math.sin(performance.now()/600 + v.origX/100)*6);
    if(Math.hypot(mx-screenX,my-screenY) < 18){ hit=v; break; }
  }
  if(hit){ villagerUI.style.display="block"; villagerUI.innerHTML=`<b>${hit.name}</b><br>Age: ${hit.age}<br>Gender: ${hit.gender}<br>${hit.work?"Working":"Idle"}`; }
  else villagerUI.style.display="none";
});

// main loop
function loop(){ draw(); requestAnimationFrame(loop); }
loop();

// ================= QUEST / UI / BUILD / REPAIR / GACHA (unchanged behaviour) =================
function updateQuest(){ let q=game.quests[0]; questTab.innerHTML=`\n <b>QUEST</b><hr>\n <b>${q.name}</b><br> Grass: ${game.res.grass}/${q.req.grass}<br>\n Wood: ${game.res.wood}/${q.req.wood}<br>\n Mud: ${game.res.mud}/${q.req.mud}\n`; }
updateQuest();

inv.onclick=()=>{ overlay.style.display="block"; let html="<h2>Inventory</h2><div style='display:grid;grid-template-columns:repeat(5,1fr);gap:8px'>"; for(let i=0;i<25;i++) html+="<div class='slot'></div>"; html+="</div>"; page.innerHTML=html; };

build.onclick = () => { overlay.style.display = "block"; page.innerHTML = `\n  <h2>Build</h2>\n  <div style="display:flex;gap:12px">\n    <div style="flex:1;text-align:center">\n      <img id="imgClassic" class="build-img" src="${hut.src}">\n      <div style="margin-top:6px;font-weight:bold">Classic Hut</div>\n    </div>\n    <div style="flex:1;text-align:center">\n      <img id="imgHouse" class="build-img" src="${house.src}">\n      <div style="margin-top:6px;font-weight:bold">House</div>\n    </div>\n  </div>\n  <div id="buildInfo" style="margin-top:12px;"></div>\n`; const infoEl = document.getElementById("buildInfo"); function showDesignInfo(name, req){ infoEl.innerHTML = `\n    <h3>${name}</h3>\n    <p>Requirements to apply this design:</p>\n    <ul>\n      <li>Grass: ${req.grass}</li>\n      <li>Wood: ${req.wood}</li>\n      <li>Mud: ${req.mud}</li>\n    </ul>\n    <div>\n      <button id="applyDesignBtn">Apply Design</button>\n      <button id="closeBuild">Close</button>\n    </div>\n    <div id="buildMsg" style="margin-top:8px;color:#c33"></div>\n`; document.getElementById("closeBuild").onclick = ()=> overlay.style.display="none"; document.getElementById("applyDesignBtn").onclick = () => { const msg = document.getElementById("buildMsg"); if(game.hut.state !== "repaired"){ msg.textContent = "Repair the hut first (repair is part of the quest)."; return; } const missing = []; if(game.res.grass < req.grass) missing.push(`Grass (${req.grass - game.res.grass})`); if(game.res.wood  < req.wood)  missing.push(`Wood (${req.wood - game.res.wood})`); if(game.res.mud   < req.mud)   missing.push(`Mud (${req.mud - game.res.mud})`); if(missing.length){ msg.textContent = "Missing: " + missing.join(", "); return; } game.res.grass -= req.grass; game.res.wood  -= req.wood; game.res.mud   -= req.mud; game.hut.design = name; refreshUI(); updateQuest(); msg.style.color = "#080"; msg.textContent = `${name} design applied to your hut.`; }; }
 document.getElementById("imgClassic").onclick = ()=> showDesignInfo("Classic Hut", {grass:25, wood:10, mud:6}); document.getElementById("imgHouse").onclick = ()=> showDesignInfo("House", {grass:30, wood:15, mud:8}); };

function openRepairMenu(){ overlay.style.display = "block"; const req = game.hut.req; page.innerHTML = `\n  <h2>Repair Hut</h2>\n  <p>Required materials to repair the hut:</p>\n  <ul>\n    <li>Grass: ${game.res.grass} / ${req.grass}</li>\n    <li>Wood: ${game.res.wood} / ${req.wood}</li>\n    <li>Mud: ${game.res.mud} / ${req.mud}</li>\n  </ul>\n  <div style="margin-top:10px;">\n    <button id="confirmRepair">Repair</button>\n    <button id="cancelRepair">Cancel</button>\n  </div>\n  <div id="repairMsg" style="margin-top:8px;color:#c33"></div>\n`; document.getElementById("cancelRepair").onclick = ()=> overlay.style.display="none"; document.getElementById("confirmRepair").onclick = doRepair; }

function doRepair(){ const req = game.hut.req; const missing = []; if(game.res.grass < req.grass) missing.push(`Grass (${req.grass - game.res.grass})`); if(game.res.wood   < req.wood)  missing.push(`Wood (${req.wood - game.res.wood})`); if(game.res.mud   < req.mud)   missing.push(`Mud (${req.mud - game.res.mud})`); const msgEl = document.getElementById("repairMsg") || page.querySelector("#buildMsg"); if(missing.length){ if(msgEl) msgEl.textContent = "Missing: " + missing.join(", "); return; } game.res.grass -= req.grass; game.res.wood  -= req.wood; game.res.mud   -= req.mud; game.hut.state = "repaired"; if(msgEl) msgEl.style.color = "#080"; page.innerHTML = `\n  <h2>Hut Repaired</h2>\n  <p>The hut has been repaired. You can now apply a design in Building → Designs.</p>\n  <div style="margin-top:10px;"><button id="closeAfterRepair">Close</button></div>\n`; document.getElementById("closeAfterRepair").onclick = ()=> overlay.style.display="none"; refreshUI(); updateQuest(); }

gacha.onclick=()=>{ overlay.style.display="block"; page.innerHTML=`\n <h2>Gacha</h2>\n <button onclick='roll1()'>Single Pull (50 💎)</button><br><br>\n <button onclick='roll10()'>10 Pull (100 💎)</button>\n <div id="out"></div>`; };
function roll1(){ if(game.diamonds<50) return alert("Not enough diamonds"); game.diamonds-=50; refreshUI(); drop(); }
function roll10(){ if(game.diamonds<100) return alert("Not enough diamonds"); game.diamonds-=100; refreshUI(); for(let i=0;i<10;i++)drop(); }
function drop(){ let pool=["Common","Rare","Epic","Legendary"]; let r=pool[Math.floor(Math.random()*pool.length)]; document.getElementById("out").innerHTML+=`<div>${r} Villager!</div>`; }

overlay.onclick=e=>{ if(e.target===overlay) overlay.style.display="none"; };
