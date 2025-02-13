//------------------------------------
// Map Channels
//------------------------------------

// Use these only for Max

#define MAXTEXCOORD0 int texcoord0 : Texcoord	\
<												\
	int Texcoord = 0;							\
	int MapChannel = 1;							\
	string UIWidget = "None";					\
>;								
		
#define MAXTEXCOORD1 int texcoord1 : Texcoord	\
<												\
	int Texcoord = 1;							\
	int MapChannel = 2;							\
	string UIWidget = "None";					\
>;

#define MAXVCOLORCOORD int texcoord5 : Texcoord	\
<												\
	int Texcoord = 5;							\
	int MapChannel = 0;							\
	string UIWidget = "None";					\
>;
#define MAXVALPHACOORD int texcoord6 : Texcoord	\
<												\
	int Texcoord = 6;							\
	int MapChannel = -2;						\
	string UIWidget = "None";					\
>;
