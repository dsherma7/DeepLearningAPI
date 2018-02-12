
# Associated enumerators for the different 
# string based parameters
class enum:
	'''
		Builds an enumerator that converts
		strings to their index and vice versa.
	'''
	items = []
	num_dic = {}
	str_dic = {}	
	def __init__(self,lst):
		self.items = lst
		self.num_dic = {x:y for x,y in enumerate(lst)}
		self.str_dic = {y:x for x,y in enumerate(lst)}		
	def __getitem__(self,i):
		if type(i) == int:
			return (self.num_dic[i])
		if type(i) == str:
			return (self.str_dic[i])
		return(self.items)
		

class parser:
	'''
		Converts the standard parameters back and forth
		from ID to string. Ideally, the numeric value will
		be stored in the database so that we don't risk bad
		string values. 
	'''
	parsers = {}
	def __init__(self):
		self.parsers = {
			"activation":enum(["ReLU", "ReLU6", "CReLU", "ExpLU","SoftPlus", "SoftSign", "Sigmoid", "Tanh"]),
			"input":enum(['','1D','2D','3D']),
			"optimizer":enum(['Gradient Descent','Adadelta','Adagrad','AdagradDA','ADAM','Momentum']),
			"type":enum(['conv','maxpool','dense','drop']),
			"padding":enum(['valid','same'])
		}
	def __getitem__(self,vals):		
		if (type(vals) != list):
			vals = [vals]
		for i,val in enumerate(vals):
			for key in self.parsers:
				if val in self.parsers[key].items:
					vals[i] = self.parsers[key][val]
		if (len(vals)==1):
			return(vals[0])
		return(vals)


id_sz = 5;
def parse_JobId(id):
	# Converts a job id to and from the string format
	if str(id)[0]!='J':
		return "J"+"0"*(id_sz-len(str(id)))+str(id)
	return id