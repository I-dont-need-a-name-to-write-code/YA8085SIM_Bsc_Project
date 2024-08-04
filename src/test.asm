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


.org 1000H
array: 
		.db 04H 20H 30H 40H 50H

.org 2000H
_start:	
		LXI H, array
		MOV C, M
    	INX H
    	XRA A
loop:	ADD M
       	JNC skip
     	INR D   
skip:	INX H
		DCR C
        JNZ loop
        MOV E,A
    	HLT

-----------------------------------------------------

# Find 3rd largest number

.ORG C000H

_start:	
	MVI B, 02H
LOOP2:	
	LXI H, F000H
	MVI C, 05H
	MVI A, 00H
LOOP1:	
	CMP M
	JNC HERE1
	MOV A, M
	MOV D, H
	MOV E, L
HERE1:	
	INX H
	DCR C
	JNZ LOOP1
	MVI A, 00H
	STAX D
	DCR B
	JNZ LOOP2
	
	LXI H, F000H
	MVI C, 05H
	MVI A, 00H
LOOP3:	
	CMP M
	JNC HERE2
	MOV A, M
HERE2:	
	INX H
	DCR C
	JNZ LOOP3
	HLT

.ORG F000H
.DB FFH 32H 23H 85H 45H


# factorial
.org 8000H
.db	05H

.org 1234H
_start:
	LXI H, 8000H
	MOV B,M
	MVI D, 01H
FACT: 
	CALL MUL
	DCR B
	JNZ FACT
    INX H
    MOV M,D
    HLT
MUL:
	MOV E,B
    XRA A
ML:
	ADD D
    DCR E 
    JNZ ML
    MOV D,A
    RET

# 255 * 257
.ORG F000H
array:

.ORG 1234H
result:

.ORG 90FFH
fill_memory:
	PUSH D
    PUSH H
    MVI D, FFH
    LXI H, array
    MVI M, FFH
    INX H
	MVI M, FFH
    INX H
loop1:
    MVI M, FFH
    DCR D
    INX H
    JNZ loop1
    MVI M, 00H
    POP H
    POP D
    RET

.ORG 9000H
_start:
	LXI SP, 0000H
	call fill_memory
    XRA A
    MVI B, 00H
	LXI H, array
loop:
	MOV D, M
    DCR D
    JC break
	ADD M
	JNC skip_carry
    INR B
skip_carry:
	INX H
    JMP loop
break:
    LXI H, result
    MOV M, A
    INX H
    MOV M, B
    HLT

--------------------------------------------
; this is a comment.
; the assembler ignores comments

.ORG 9000H
data: .DB 0AH

.ORG F000H
_start:
	LXI H, data
	MVI A, 05H
    MOV B, M
loop:
	CALL increment_regB
    DCR A
    JNZ loop
    HLT

increment_regB:
	INR B
	RET

