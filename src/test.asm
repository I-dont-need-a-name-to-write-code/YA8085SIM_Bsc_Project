# 8 BIT DIVISION
.ORG 2000H
_start:
	   LHLD 2501h
	   LDA 2503h
	   MOV B , A
	   MVI C,08h
LOOP:	   
       DAD H
	   MOV A, H
	   SUB B
	   JC AHEAD
	   MOV H,A
	   INR L

AHEAD: DCR C
	   JNZ LOOP
	   SHLD 2504h
	   HLT

.ORG 2501H
# LSB OF DIVIDEND , MSB OF DIVIDEND , DIVISOR
.DB 9BH 48H 1AH	

-----------------------------------------------------

# array additon
.org 3000H
_start:
	LXI H, array
	MOV C, M
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

-----------------------------------------------------

# 3rd largest out of 5 numbers

.ORG C000H

_start:	MVI B,02H
LOOP2:	LXI H,F000H
	MVI C,05H
	MVI A,00H
LOOP1:	CMP M
	JNC HERE1
	MOV A,M
	MOV D,H
	MOV E,L
HERE1:	INX H
	DCR C
	JNZ LOOP1
	MVI A,00H
	STAX D
	DCR B
	JNZ LOOP2
	
	LXI H,F000H
	MVI C,05H
	MVI A,00H
LOOP3:	CMP M
	JNC HERE2
	MOV A,M
HERE2:	INX H
	DCR C
	JNZ LOOP3
	HLT

.ORG F000H
.DB FFH 32H 23H 85H 45H

