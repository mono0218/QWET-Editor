#define Pi 3.1415926
#define SPEED 30
#define FREQUENCY 1
#define YSIZE 1
#define DIRECTION 0
#define DIR 1

#if DIRECTION
	#define TURNDIRECTION Pos.xyz=mul(Pos.xyz,TurnDirection);
	#define MATRIX static float3x3 TurnDirection = {normalize(WorldViewInverse[0].xyz),normalize(WorldViewInverse[1].xyz),normalize(WorldViewInverse[2].xyz),};
#else
	#define TURNDIRECTION 
	#define MATRIX
#endif

float time:TIME;
float4x4 WorldViewInverse : WORLDVIEWINVERSE;
float4x4 WorldViewProjMatrix:WORLDVIEWPROJECTION;
float Speed : CONTROLOBJECT < string name = "Controller.pmx"; string item = "Speed"; >;
float YSize : CONTROLOBJECT < string name = "Controller.pmx"; string item = "YSize"; >;
float Frequency : CONTROLOBJECT < string name = "Controller.pmx"; string item = "Frequency"; >;
float Draw : CONTROLOBJECT < string name = "Controller.pmx"; string item = "Draw"; >;
float ColorR : CONTROLOBJECT < string name = "Controller.pmx"; string item = "ColorR"; >;
float ColorG : CONTROLOBJECT < string name = "Controller.pmx"; string item = "ColorG"; >;
float ColorB : CONTROLOBJECT < string name = "Controller.pmx"; string item = "ColorB"; >;
MATRIX
struct Result
{
    float4 Pos        : POSITION;        
    float2 Tex        : TEXCOORD0;
	float4 Color      : Color0;
};
Result Light_VS(float4 Pos:POSITION,float2 Tex:TEXCOORD0){
	Result input; 
	input.Color=float4(1-ColorR,1-ColorG,1-ColorB,1);
	float a=((DIR)*Pos.x+0.75-Draw);
	input.Color.a=(a-0.15001>0.1)?clamp(a*4,0,1):0;
	float Value=0.4*YSIZE*(1-YSize)+0.3*YSIZE;
	float b=70*FREQUENCY*(1-Frequency)+30*FREQUENCY;
	float p=time*SPEED*(1-Speed);
	Pos.y+=(pow(Pos.x*Value,0.667)+sqrt(pow(Value/2,2)-pow(Pos.x*Value,2))*sin(b*Pi*Pos.x*Value+p));
	TURNDIRECTION
	input.Pos=mul(Pos,WorldViewProjMatrix); 
	input.Tex=Tex;
	
	return input;   
}         
float4 Light_PS(Result input):COLOR0
{     
	float4 Color;     
	Color=float4(1,1,1,1)*input.Color;
	return Color; 
}
 
technique MainTec <string MMDPass = "object";>{
	pass LightPass {
		//ZWRITEENABLE = false;
		CULLMODE = NONE;
		VertexShader = compile vs_3_0 Light_VS();
		PixelShader  = compile ps_3_0 Light_PS();
	}
}
technique Main_ssTec <string MMDPass = "object_ss";>{
	pass LightPass {
		//ZWRITEENABLE = false;
		CULLMODE = NONE;
		VertexShader = compile vs_3_0 Light_VS();
		PixelShader  = compile ps_3_0 Light_PS();
	}
}