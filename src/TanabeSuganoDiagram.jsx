import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const d4c = 27.1356792;
const d5c = 27.9394646;

const configs = {
  'd2': { terms: [ //add more sig figs later if desired
      { label: '3T1(F)', color: 'steelblue', allowed: true, fn: (x) => 0 },
      { label: '3T2(F)', color: 'orange', allowed: true, fn: (x) => 0.8286*x + 0.005146*x**2 - 0.00005798*x**3 },
      { label: '3A2(F)', labelPosX: 35, labelAdjustX: 0, labelAdjustY: -30, color: 'green', allowed: true, fn: (x) => 1.8286*x + 0.005146*x**2 - 0.00005798*x**3 },
      { label: '3T1(P)', color: 'purple', allowed: true, fn: (x) => 14.864 + 0.6827*x + 0.009024*x**2 - 0.00009750*x**3 },
      { label: '1T2(D)', labelPosX: 10, labelAdjustX: 0, labelAdjustY: 20, allowed: false, fn: (x) => 13.852 + 0.3724*x - 0.03294*x**2 +0.001387*x**3 -0.00002830*x**4 + 2.2359*(10**-7)*x**5 },
      { label: '1E(D)', labelPosX: 10, labelAdjustX: 0, labelAdjustY: -10, allowed: false, fn: (x) => 13.84 + 0.7374*x -0.08559*x**2 +0.004311*x**3 -0.00009952*x**4 + 8.5933*(10**-7)*x**5 },
      { label: '1T2(G)', allowed: false, fn: (x) => 20.84 + 0.2285*x +0.05275*x**2 -0.002032*x**3 +0.00003996*x**4 -3.1056*(10**-7)*x**5 },
      { label: '1E(G)', labelPosX: 27, labelAdjustX: 0, labelAdjustY: -20, allowed: false, fn: (x) => 20.84 + 0.8688*x +0.1047*x**2 -0.004917*x**3 +0.0001102*x**4 -9.3770*(10**-7)*x**5 },
      { label: '1T1(G)', allowed: false, fn: (x) => 20.84 + 0.8031*x +0.009562*x**2 -0.0003032*x**3 +5.3568*10**-6*x**4 -3.9187*(10**-8)*x**5 },
      { label: '1A1(G)', allowed: false, fn: (x) => 20.84 + 1.0286*x -0.02882*x**2 +0.0001739*x**3 +7.2070*10**-6*x**4 -1.062*(10**-7)*x**5 },
      { label: '1A1(S)', labelPosX: 14, labelAdjustX: -5, labelAdjustY: -20, allowed: false, fn: (x) => 52.94 + 0.5774*x +0.04798*x**2 -0.0007824*x**3 +3.5591*10**-6*x**4 +2.7330*(10**-7)*x**5 },
    ], freeIonLabels: [
      { label: '1S', labelPosY: 52.94, labelAdjustY: 8 },
      { label: '1G', labelPosY: 20.84, labelAdjustY: 5 },
      { label: '3P', labelPosY: 15, labelAdjustY: -5 },
      { label: '3F', labelPosY: 0, labelAdjustY: -5 },
      { label: '1D', labelPosY: 13.84, labelAdjustY: 15 },
    ]},
  'd3': { terms: [
      { label: '4A2(F)', color: 'steelblue', allowed: true, fn: (x) => 0 },
      { label: '4T2(F)', color: 'orange', allowed: true, fn: (x) => x },
      { label: '4T1(F)', labelPosX: 35, labelAdjustX: 0, labelAdjustY: -30, color: 'green', allowed: true, fn: (x) => 1.835*x + -0.0221532*x**2 + 0.000199758*x**3  },
      { label: '4T1(P)', color: 'purple', allowed: true, fn: (x) => 15 + 1.165*x + 0.0221532*x**2 + -0.000199758*x**3  },
      { label: '2A1(G)', labelPosX: 10, labelAdjustX: 0, labelAdjustY: 20, allowed: false, fn: (x) => 17.5016 + x },
      { label: '2E(G)', labelPosX: 10, labelAdjustX: 0, labelAdjustY: -10, allowed: false, fn: (x) => 17.5016 + 0.362514*x + -0.0119856*x**2 + 0.000128095*x**3   },
      { label: '2T1(G)', allowed: false, fn: (x) => 17.5016 + 0.485589*x + -0.0166284*x**2 + 0.000178069*x**3  },
      { label: '2T2(G)', labelPosX: 27, labelAdjustX: 0, labelAdjustY: -20, allowed: false, fn: (x) => 17.5016 + 1.23115*x + -0.0346798*x**2 + 0.000337976*x**3  },
      { label: '2A2(F)', allowed: false, fn: (x) => 37.5016077 + x },
    ], freeIonLabels: [ //need to do
      { label: '1S', labelPosY: 52.94, labelAdjustY: 8 },
      { label: '1G', labelPosY: 20.84, labelAdjustY: 5 },
      { label: '3P', labelPosY: 15, labelAdjustY: -5 },
      { label: '3F', labelPosY: 0, labelAdjustY: -5 },
      { label: '1D', labelPosY: 13.84, labelAdjustY: 15 },
    ]},
  'd4': { terms: [
    { label: '5E(D)', allowedEnd: d4c, color: 'steelblue', allowed: true, fn: (x) => x <= d4c ? 0 : 0.915464*(x-d4c) + 0.00420368*(x-d4c)**2 + -0.0000850281*(x-d4c)**3 },
    { label: '5T2(D)', allowedEnd: d4c, color: 'orange', allowed: true, fn: (x) => x <= d4c ? x : d4c + 1.91546*(x-d4c) + 0.00420364*(x-d4c)**2 + -0.0000850272*(x-d4c)**3 },
    { label: '3E(H)', allowedStart: d4c, labelPosX: 31, labelAdjustX: 0, labelAdjustY: -15, allowed: true, color: 'green', fn: (x) => x <= d4c ? 22.4020101 + 0.145953*x + -0.00766367*x**2 + 0.000138297*x**3 : 23.4398191 + 0.921438*(x-d4c) + 0.00405374*(x-d4c)**2 + -0.0000831305*(x-d4c)**3 },
    { label: '3T1(H)', allowedStart: d4c, allowed: true, color: 'purple', fn: (x) => x <= d4c ? 22.4020101 -0.32644*x + -0.0360998*x**2 + 0.000672*x**3 : 0 },
    { label: '3T2(H)', allowedStart: d4c, allowed: true, color: 'teal', fn: (x) => x <= d4c ? 22.4020101 + 0.595581*x + -0.0358792*x**2 + 0.000693441*x**3 : 25.7465967 + 0.926736*(x-d4c) + 0.003923*(x-d4c)**2 + -0.000081479*(x-d4c)**3 },
    { label: '3A2(F)', allowedStart: d4c, labelPosX: 16, labelAdjustX: 0, labelAdjustY: -10, allowed: true, color: 'crimson', fn: (x) => x <= d4c ? 25.7456131 + 0.178647*x + -0.0040449*x**2 + 0.0000451676*x**3 : 28.5120214 + 0.96987*(x-d4c) + 0.00332458*(x-d4c)**2 + -0.000076666*(x-d4c)**3 },
    { label: '3A1(G)', allowedStart: d4c, labelPosX: 40, labelAdjustX: 0, labelAdjustY: 15, allowed: true, color: 'maroon', fn: (x) => x <= d4c ? 27.4020101 : 27.4020101 + 0.915464*(x-d4c) + 0.00420368*(x-d4c)**2 + -0.0000850281*(x-d4c)**3 },
    { label: '1A1(I)', allowedStart: d4c, labelPosX: 37.5, labelAdjustX: -10, labelAdjustY: -20, allowed: false, color: 'orchid', fn: (x) => x <= d4c ? 33.6030151 + 0.561479*x + -0.0563826*x**2 + 0.000938388*x**3 : 25.7375176 + 0.26816*(x-d4c) + -0.00223591*(x-d4c)**2 + -0.0000234598*(x-d4c)**3 },
    { label: '1A2(I)', allowedStart: d4c, labelPosX: 28, labelAdjustX: -20, labelAdjustY: -5, allowed: false, color: 'olive', fn: (x) => x <= d4c ? 33.6030151 + 0.184698*x + -0.00674203*x**2 + 0.000100222*x**3 : 35.6328178 + 0.940497*(x-d4c) + 0.00366865*(x-d4c)**2 + -0.0000788954*(x-d4c)**3 },
    { label: '1E(I)', allowedStart: d4c, labelPosX: 16, labelAdjustX: 0, labelAdjustY: -10, allowed: false, color: 'red', fn: (x) => x <= d4c ? 33.6030151 + -0.237758*x + -0.0293213*x**2 + 0.00044221*x**3 : 14.3071558 + -0.00340859*(x-d4c) + 0.00228598*(x-d4c)**2 + -0.000061694*(x-d4c)**3 },
    { label: '1T1(I)', allowedStart: d4c, labelPosX: 40, labelAdjustX: 0, labelAdjustY: 15, allowed: false, color: 'skyblue', fn: (x) => x <= d4c ? 33.6030151 + 0.642949*x + -0.032073*x**2 + 0.000578567*x**3 : 38.7914146 + 0.962129*(x-d4c) + 0.0031226*(x-d4c)**2 + -0.0000720844*(x-d4c)**3 },
    { label: '1T2(I)', allowedStart: d4c, labelPosX: 37.5, labelAdjustX: -10, labelAdjustY: -20, allowed: false, color: 'violet', fn: (x) => x <= d4c ? 33.6030151 + -0.257754*x + -0.03576*x**2 + 0.000643885*x**3 : 12.9270276 + -0.00620412*(x-d4c) + 0.00286826*(x-d4c)**2 + -0.0000714804*(x-d4c)**3 },
    { label: '1A2(F)', allowedStart: d4c, labelPosX: 28, labelAdjustX: -20, labelAdjustY: -5, allowed: false, color: 'green', fn: (x) => x <= d4c ? 48.6030151 + 0.815301*x + 0.00674204*x**2 + -0.000100222*x**3 : 73.7088907 + 1.89043*(x-d4c) + 0.00473866*(x-d4c)**2 + -0.0000911598*(x-d4c)**3 },
    { label: '3A2(F)', allowedStart: d4c, labelPosX: 28, labelAdjustX: -20, labelAdjustY: -5, allowed: true, color: 'indigo', fn: (x) => x <= d4c ? 56.8599146 + 0.821353*x + 0.00404491*x**2 + -0.0000451679*x**3 : 81.2291847 + 1.86106*(x-d4c) + 0.00508273*(x-d4c)**2 + -0.0000933893*(x-d4c)**3 },
  ], freeIonLabels: [ //come back
    { label: '4F', labelPosY: 0, labelAdjustY: -5 },
    { label: '4P', labelPosY: 15, labelAdjustY: 22 },
    { label: '2G', labelPosY: 18, labelAdjustY: 7 },
    { label: '2F', labelPosY: 38, labelAdjustY: 13 },
  ]},
  'd5': { terms: [
    { label: '6A1', allowedEnd: d5c, color: 'steelblue', allowed: true, fn: (x) => x <= d5c ? 0 : 1.74538*(x-d4c) + 0.0144926*(x-d4c)**2 + -0.000286247*(x-d4c)**3 },
    { label: '4T1(G)', allowedEnd: d5c, color: 'orange', allowed: true, fn: (x) => x <= d5c ? 32.39814 + -0.395368*(x) + -0.0344829*(x)**2 + 0.000644131*(x)**3 : 8.218774 + 0.763789*(x-d4c) + 0.0140981*(x-d4c)**2 + -0.000281817*(x-d4c)**3 },
    { label: '4T2(G)', allowedStart: d5c, labelPosX: 31, labelAdjustX: 0, labelAdjustY: -15, allowed: true, color: 'green', fn: (x) => x <= d5c ? 32.39814 + 0.08511*(x) + -0.0388051*(x)**2 + 0.000495105*(x)**3 : 15.29336 + 0.806387*(x-d4c) + 0.0128103*(x-d4c)**2 + -0.000264615*(x-d4c)**3 },
    { label: '4A1/4E', allowedStart: d5c, allowed: true, color: 'purple', fn: (x) => x <= d5c ? 32.39814 : 32.39814 + 1.74538*(x-d4c) + 0.0144926*(x-d4c)**2 + -0.000286248*(x-d4c)**3 },
    { label: '4T2(D)', allowedStart: d5c, allowed: true, color: 'teal', fn: (x) => x <= d5c ? 39.39814 + -0.204904*(x) + -0.00250679*(x)**2 + 0.000190967*(x)**3 : 35.6745 + 1.72724*(x-d4c) + 0.0151255*(x-d4c)**2 + -0.000295252*(x-d4c)**3 },
    { label: '4E(D)', allowedStart: d5c, labelPosX: 16, labelAdjustX: 0, labelAdjustY: -10, allowed: true, color: 'crimson', fn: (x) => x <= d5c ? 39.39814 : 39.39814 + 1.74538*(x-d4c) + 0.0144926*(x-d4c)**2 + -0.000286248*(x-d4c)**3 },
    { label: '2T2(I)', allowedStart: d5c, labelPosX: 40, labelAdjustX: 0, labelAdjustY: 15, allowed: true, color: 'maroon', fn: (x) => x <= d5c ? 46.83702 + -0.537102*(x) + -0.0811059*(x)**2 + 0.00150346*(x)**3 : 0 },
    { label: '2A2(I)', allowedStart: d5c, labelPosX: 37.5, labelAdjustX: -10, labelAdjustY: -20, allowed: false, color: 'orchid', fn: (x) => x <= d5c ? 46.83702 + -0.271306*(x) + -0.0395462*(x)**2 + 0.000714363*(x)**3 : 23.70508 + 0.766133*(x-d4c) + 0.0139875*(x-d4c)**2 + -0.000280179*(x-d4c)**3 },
    { label: '2T1(I)', allowedStart: d5c, labelPosX: 28, labelAdjustX: -20, labelAdjustY: -5, allowed: false, color: 'olive', fn: (x) => x <= d5c ? 46.83702 + -0.231533*(x) + -0.0411242*(x)**2 + 0.00073514*(x)**3 : 24.04123 + 0.766849*(x-d4c) + 0.0139683*(x-d4c)**2 + -0.000279891*(x-d4c)**3 },
    { label: '2E(I)', allowedStart: d5c, labelPosX: 16, labelAdjustX: 0, labelAdjustY: -10, allowed: false, color: 'red', fn: (x) => x <= d5c ? 46.83702 + 0.101642*(x) + -0.0444423*(x)**2 + 0.000635376*(x)**3 : 28.79956 + 0.797423*(x-d4c) + 0.0132293*(x-d4c)**2 + -0.000270896*(x-d4c)**3 },
    { label: '2A1(I)', allowedStart: d5c, labelPosX: 40, labelAdjustX: 0, labelAdjustY: 15, allowed: false, color: 'skyblue', fn: (x) => x <= d5c ? 46.83702 + -0.0651213*(x) + 0.0113044*(x)**2 + -0.000602579*(x)**3 : 40.69406 + 0.938211*(x-d4c) + 0.00750762*(x-d4c)**2 + -0.000180795*(x-d4c)**3 },
    { label: '4A2(F)', allowedStart: d5c, labelPosX: 37.5, labelAdjustX: -10, labelAdjustY: -20, allowed: false, color: 'violet', fn: (x) => x <= d5c ? 53.35739 : 53.35739 + 1.74538*(x-d4c) + 0.0144924*(x-d4c)**2 + -0.00028624*(x-d4c)**3 },
  ], freeIonLabels: [ //come back
    { label: '4F', labelPosY: 0, labelAdjustY: -5 },
    { label: '4P', labelPosY: 15, labelAdjustY: 22 },
    { label: '2G', labelPosY: 18, labelAdjustY: 7 },
    { label: '2F', labelPosY: 38, labelAdjustY: 13 },
  ]},
  'd7': { terms: [ //probably come back and fix these
    { label: '4T1(F)', allowedEnd: 21.29, color: 'steelblue', allowed: true, fn: (x) => x <= 21.29 ? 0 :  -1.9078*x +0.1539*x**2 -0.004026*x**3 +0.00005191*x**4 -2.638*(10**-7)*x**5 },
    { label: '4T2(F)', allowedEnd: 21.29, color: 'orange', allowed: true, fn: (x) => x <= 21.29 ? 0.8002*x +0.01055*x**2 -0.0004101*x**3 +0.00001007*x**4 -1.1280*(10**-7)*x**5 : -1.0867*x +0.1608*x**2 -0.004186*x**3 +0.00005391*x**4 -2.741*(10**-7)*x**5 },
    { label: '4A2(F)', allowedEnd: 21.29, labelPosX: 31, labelAdjustX: 0, labelAdjustY: -15, allowed: true, color: 'green', fn: (x) => x <= 21.29 ? 1.800*x +0.01055*x**2 -0.0004101*x**3 +0.00001007*x**4 -1.128*(10**-7)*x**5 : 40.7412738 -6.3145*x +0.5340*x**2 -0.01515*x**3 +0.0002120*x**4 -0.000001171*x**5 },
    { label: '4T1(P)', allowedEnd: 21.29, allowed: true, color: 'purple', fn: (x) => x <= 21.29 ? 15 + 0.6004*x +0.02109*x**2 -0.0008202*x**3 +0.00002014*x**4 -2.256*(10**-7)*x**5 : 32.5880254 -3.954*x +0.3288*x**2 -0.009080*x**3 +0.0001242*x**4 -6.714*(10**-7)*x**5 },
    { label: '2T2(G)', allowedStart: 21.29, allowed: true, color: 'teal', fn: (x) => x <= 21.29 ? 17.89 + 0.4322*x -0.04047*x**2 +0.001839*x**3 -0.00003862*x**4 +2.633*(10**-7)*x**5 : 19.7133408 -1.900*x +0.1534*x**2 -0.004021*x**3 + 0.00005196*x**4 -2.646*(10**-7)*x**5 },
    { label: '2E(G)', allowedStart: 21.29, labelPosX: 16, labelAdjustX: 0, labelAdjustY: -10, allowed: true, color: 'crimson', fn: (x) => x <= 21.29 ? 17.89 + 0.4470*x -0.2604*x**2 +0.02312*x**3 -0.0009743*x**4 +0.00001557*x**5 : 0 },
    { label: '2T1(G)', allowedStart: 21.29, labelPosX: 40, labelAdjustX: 0, labelAdjustY: 15, allowed: true, color: 'maroon', fn: (x) => x <= 21.29 ? 17.89 + 0.6824*x -0.1264*x**2 +0.01087*x**3 -0.0004517*x**4 +7.236*(10**-6)*x**5 : 19.0321308 -2.174*x +0.1835*x**2 -0.005291*x**3 +0.00007531*x**4 -4.225*(10**-7)*x**5 },
    { label: '2A1(G)', allowedStart: 21.29, labelPosX: 37.5, labelAdjustX: -10, labelAdjustY: -20, allowed: true, color: 'orchid', fn: (x) => x <= 21.29 ? 17.89 + 0.8186*x +0.001488*x**2 +0.0009939*x**3 -0.00007574*x**4 +1.689*(10**-6)*x**5 : 38.1477383 -4.447*x +0.3761*x**2 -0.01087*x**3 +0.0001549*x**4 -8.697*(10**-7)*x**5 },
    { label: '2A2(G)', allowedStart: 21.29, labelPosX: 28, labelAdjustX: -20, labelAdjustY: -5, allowed: true, color: 'olive', fn: (x) => x <= 21.29 ? 37.8894523 + 0.8190*x +0.001386*x**2 +0.001004*x**3 -0.00007620*x**4 +1.696*(10**-6)*x**5 : 58.1477383 -4.447*x +0.3761*x**2 -0.01087*x**3 +0.0001549*x**4 -8.697*(10**-7)*x**5 },
  ], freeIonLabels: [
    { label: '4F', labelPosY: 0, labelAdjustY: -5 },
    { label: '4P', labelPosY: 15, labelAdjustY: 22 },
    { label: '2G', labelPosY: 18, labelAdjustY: 7 },
    { label: '2F', labelPosY: 38, labelAdjustY: 13 },
  ]},
  'd8': { terms: [
    { label: '3A2(F)', color: 'steelblue', allowed: true, fn: (x) => 0 },
    { label: '3T2(F)', color: 'orange', allowed: true, fn: (x) => x },
    { label: '3T1(F)', labelPosX: 31, labelAdjustX: 0, labelAdjustY: -15, allowed: true, color: 'green', fn: (x) => 1.85171*x + -0.0235226*x**2 + 0.000224323*x**3 },
    { label: '1E(D)', allowed: false, color: 'purple', fn: (x) => 14.42035 + 0.359359*x + -0.0139245*x**2 + 0.000166059*x**3  },
    { label: '1T2(D)', allowed: false, color: 'teal', fn: (x) => 14.42035 + 1.27971*x + -0.00975625*x**2 + 0.000110217*x**3 },
    { label: '3T1(P)', labelPosX: 16, labelAdjustX: 0, labelAdjustY: -10, allowed: true, color: 'crimson', fn: (x) => 15 + 1.14829*x + 0.0235226*x**2 + -0.000224323*x**3  },
    { label: '1A1(G)', labelPosX: 40, labelAdjustX: 0, labelAdjustY: 15, allowed: false, color: 'maroon', fn: (x) => 21.4203455 + 0.721145*x + -0.0188482*x**2 + 0.000181718*x**3 },
    { label: '1T1(G)', labelPosX: 37.5, labelAdjustX: -10, labelAdjustY: -20, allowed: false, color: 'orchid', fn: (x) => 21.4203455 + x },
    { label: '1E(G)', labelPosX: 28, labelAdjustX: -20, labelAdjustY: -5, allowed: false, color: 'olive', fn: (x) => 21.4203455 + 1.64064*x + 0.0139246*x**2 + -0.00016606*x**3  },
    { label: '1T2(G)', allowed: false, color: 'red', fn: (x) => 21.4203455 + 1.72029*x + 0.00975628*x**2 + -0.000110218*x**3 },
    { label: '1A1(S)', allowed: false, color: 'gold', fn: (x) => 54.9712092 + 1.27885*x + 0.0188482*x**2 + -0.000181719*x**3 },
  ], freeIonLabels: [ //TODO
    { label: '4F', labelPosY: 0, labelAdjustY: -5 },
    { label: '4P', labelPosY: 15, labelAdjustY: 22 },
    { label: '2G', labelPosY: 18, labelAdjustY: 7 },
    { label: '2F', labelPosY: 38, labelAdjustY: 13 },
  ]},
};

const TanabeSuganoDiagram = () => {
  const svgRef = useRef();
  const [deltaB, setDeltaB] = useState(25);
  const [config, setConfig] = useState('d2');

  useEffect(() => {
    const terms = configs[config].terms;
    const freeIonLabels = configs[config].freeIonLabels;
    const width = 570;
    const height = 800;
    const margin = { top: 20, right: 40, bottom: 60, left: 60 };
    const yMax = 70;
    const deltaBStart = 0;
    const deltaBEnd = 40;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', 'white');

    const xScale = d3.scaleLinear().domain([0, 40]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([0, 70]).range([height - margin.bottom, margin.top]);

    svg.selectAll('*').remove();

    const xAxis = d3.axisBottom(xScale).tickSizeOuter(6);
    const yAxis = d3.axisLeft(yScale).tickSizeOuter(6);

    svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(yAxis)
    .selectAll('text') // Select all axis tick labels
    .attr('fill', 'black')
    .classed('noSelect', true)
    .style('font-size', '14px');

    svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .selectAll('text') // Select all axis tick labels
    .attr('fill', 'black') 
    .classed('noSelect', true)
    .style('font-size', '14px');

    svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", width * 1.1 / 2)
    .attr("y", height - .2 * margin.bottom) // position below axis
    .attr("font-weight", "bold")
    .style("font-size", "18px")
    .classed('noSelect', true)
    .text("Δ / B");

    svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", -height / 2)
    .attr("y", margin.left / 3) // position to the left of y-axis
    .attr("transform", `rotate(-90)`)
    .attr("font-weight", "bold")
    .style("font-size", "18px")
    .classed('noSelect', true)
    .text("E / B");

    // Plot free ion labels
    freeIonLabels.forEach(term => {
      svg.append('text')
        .attr('x', margin.left - 20)
        .attr('y', yScale(term.labelPosY) - 5 + term.labelAdjustY)
        .attr('fill', 'black')
        .style('font-size', '14px')
        .classed('noSelect', true)
        .text(term.label);
      }
    );

    // Plot curves
    terms.forEach(term => {
      term.color = term.color || 'black';

      const line = d3.line()
        .defined(d => term.fn(d) >= 0 && term.fn(d) <= yMax)
        .x(d => xScale(d))
        .y(d => yScale(term.fn(d)));

      // needs to be refactored for where there is a crystal field strength shift but singlet states are always disallowed (marked in term.allowed)
      if(term.allowedEnd) {
        svg.append('path')
          .datum(d3.range(deltaBStart, term.allowedEnd, 0.25))
          .attr('fill', 'none')
          .attr('stroke', term.color)
          .attr('stroke-width', 2)
          .attr('d', line);   
          
          svg.append('path')
            .datum(d3.range(term.allowedEnd, deltaBEnd, 0.25))
            .attr('fill', 'none')
            .attr('stroke', 'gray')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '4')
            .attr('d', line);

      } else if (term.allowedStart) {
        svg.append('path')
          .datum(d3.range(deltaBStart, term.allowedStart, 0.25))
          .attr('fill', 'none')
          .attr('stroke', 'gray')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '4')
          .attr('d', line);
       
        svg.append('path')
          .datum(d3.range(term.allowedStart, deltaBEnd, 0.25))
          .attr('fill', 'none')
          .attr('stroke', term.color)
          .attr('stroke-width', 2)
          .attr('d', line);   
      } else {
        if(term.allowed) {
          svg.append('path')
            .datum(d3.range(deltaBStart, deltaBEnd, 0.25))
            .attr('fill', 'none')
            .attr('stroke', term.color)
            .attr('stroke-width', 2)
            .attr('d', line);
        } else {
          svg.append('path')
            .datum(d3.range(deltaBStart, deltaBEnd, 0.25))
            .attr('fill', 'none')
            .attr('stroke', 'gray')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '4')
            .attr('d', line);
        }
      }

      if(terms.some(term => term.allowedStart || term.allowedEnd)) {
        svg.append('line')
          .attr('x1', xScale(terms[0].allowedStart || terms[0].allowedEnd))
          .attr('x2', xScale(terms[0].allowedStart || terms[0].allowedEnd))
          .attr('y1', margin.top - 15)
          .attr('y2', height - margin.bottom + 20)
          .attr('stroke', 'gray')
          .attr('stroke-width', 2)
          .style('pointer-events', 'none');
  
      }

      if(term.labelPosX) {
        svg.append('text')
          .attr('x', xScale(term.labelPosX) + term.labelAdjustX)
          .attr('y', yScale(term.fn(term.labelPosX)) + term.labelAdjustY)
          .attr('fill', term.color)
          .style('font-size', '14px')
          .classed('noSelect', true)
          .text(term.label);
      } else {
        svg.append('text')
          .attr('x', width - margin.right - 10)
          .attr('y', yScale(term.fn(40)) - 5)
          .attr('fill', term.color)
          .style('font-size', '14px')
          .classed('noSelect', true)
          .text(term.label);
      }
    });

    // Vertical line
    const dragLine = svg.append('line')
      .attr('x1', xScale(deltaB))
      .attr('x2', xScale(deltaB))
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom)
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .style('pointer-events', 'none');

    function updateLine(pos) {
      const [mouseX] = d3.pointer(pos, svg.node());
      const boundedXVal = Math.max(margin.left, Math.min(width - margin.right, mouseX));
      setDeltaB(xScale.invert(boundedXVal));
    }

    svg.on('mousedown', () => {
      svg.on('mousemove', (event) => updateLine(event) );
    });

    svg.on('mouseup', () => {
      svg.on('mousemove', null);
    });

    svg.on("touchstart", (event) => {
      event.preventDefault(); // Prevent scrolling
      updateLine(event.touches[0]);
    })
    .on("touchmove", (event) => {
      event.preventDefault();
      updateLine(event.touches[0]);
    })
    

  }, [deltaB, config]);

  const terms = configs[config].terms;

  return (
    <div style={{ 
        backgroundColor: 'white',
        minHeight: '100vh',
        width: '100%',
        padding: '20px'
      }}>

    <div>
      <h2 style={{ color: 'black' }}>Tanabe-Sugano Diagram ({config})</h2>
      <div style={{ marginBottom: '10px', color: 'black' }}>
        <label>Select configuration: </label>
        <select value={config} onChange={e => setConfig(e.target.value)}>
          <option value="d2">d²</option>
          <option value="d7">d⁷</option>
        </select>
        <label>   Drag vertical line to reposition.</label>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      <div style={{ 
        border: '2px solid #666',
        borderRadius: '4px',
        padding: '15px',
        display: 'inline-block',
        backgroundColor: 'white'
      }}>
        <svg ref={svgRef}></svg>
      </div>
      <div style={{ marginLeft: '20px', marginTop: '10px', color: 'black' }}>
        <strong>Δ/B:</strong> {deltaB.toFixed(2)}
        <ul>
          {terms.map(term => (
            <li key={term.label} style={{ color: (term.allowedEnd && deltaB > term.allowedEnd) || (term.allowedStart && deltaB < term.allowedStart) || !term.allowed ? 'black' : term.color }}>
              {term.label}: E/B = {Math.max(term.fn(deltaB).toFixed(2), 0)}
            </li>
          ))}
        </ul>
        <strong>ν₂/ν₁:</strong> {Math.max((terms[2].fn(deltaB) / terms[1].fn(deltaB)).toFixed(2), 0)}
      </div>
      </div>
    </div>
    </div>
  );
};

export default TanabeSuganoDiagram;
