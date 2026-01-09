from contextlib import nullcontext


class Node:
    def __init__(self,item):
        self._next = None  
        self._item = item  # private instance variable
        self._pre  = None


    def __init__(self, pre , item, next):
        self._next = next  # private instance variable
        self._item = item  # private instance variable
        self._pre  = pre
        

    def get_next():
        return self.__next
    
    def set_next(link):
        self.__next =link


    def get_item():
        return self.__item
    
    def set_item(item):
        self.__item=item



    def get_pre():
        return self.__pre
    
    def set_pre(link):
        self.__pre =link

