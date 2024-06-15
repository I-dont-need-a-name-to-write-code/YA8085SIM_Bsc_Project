# 8 BIT DIVISION
.ORG 2000H
	   LHLD 2501
	   LDA 2503
	   MOV B , A
	   MVI C,08

LOOP:	   DAD H
	   MOV A, H
	   SUB B
	   JC AHEAD
	   MOV H,A
	   INR L

AHEAD:	   DCR C
	   JNZ LOOP
	   SHLD 2504
	   HLT

.ORG 2501H
# LSB OF DIVIDEND , MSB OF DIVIDEND , DIVISOR
.DB 9BH,48H,1AH	

-----------------------------------------------------

# array additon
.org 3000H
_start:
	LXI H, array
	MVI C, M
	INX H
	MVI A, 00H
label1:	ADD M
	INX H
	DCR C
	JNZ label1
	HLT

.org 4000H
array: 
.db 04H 10H 20H 40H 80H



