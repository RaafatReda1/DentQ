SELECT distinct القرارات.[رقم القرار], القرارات.[تاريخ القرار], القرارات.[نوع القرار], القرارات.[اسم العميل], القرارات.المركز, القرارات.[الرقم القومى], القرارات.[مضمون القرار], القرارات.[حالة القرار], القرارات.[وصف المبنى], القرارات.العنوان, القرارات.[الاجراءات المنخذه], القرارات.[موقف المرافق], القرارات.[حالة الاشغال], القرارات.[سبب عدم  التنفيذ]
FROM القرارات
WHERE (القرارات.[رقم القرار] = [Forms]![frmNavigation]![NavigationSubform].Form![num]
     OR [Forms]![frmNavigation]![NavigationSubform].Form![num] Is Null)

AND (القرارات.[تاريخ القرار] Like "*" & [Forms]![frmNavigation]![NavigationSubform].Form![date] & "*"
     OR [Forms]![frmNavigation]![NavigationSubform].Form![date] Is Null)

AND (القرارات.[نوع القرار] Like "*" & [Forms]![frmNavigation]![NavigationSubform].Form![type] & "*"
     OR [Forms]![frmNavigation]![NavigationSubform].Form![type] Is Null)

AND (القرارات.[اسم العميل] Like "*" & [Forms]![frmNavigation]![NavigationSubform].Form![client_name] & "*"
     OR [Forms]![frmNavigation]![NavigationSubform].Form![client_name] Is Null)

AND (القرارات.المركز Like "*" & [Forms]![frmNavigation]![NavigationSubform].Form![state] & "*"
     OR [Forms]![frmNavigation]![NavigationSubform].Form![state] Is Null)

AND (القرارات.[الرقم القومى] Like "*" & [Forms]![frmNavigation]![NavigationSubform].Form![national_id] & "*"
     OR [Forms]![frmNavigation]![NavigationSubform].Form![national_id] Is Null)

AND (القرارات.[مضمون القرار] Like "*" & [Forms]![frmNavigation]![NavigationSubform].Form![context] & "*"
     OR [Forms]![frmNavigation]![NavigationSubform].Form![context] Is Null)

AND (القرارات.[حالة القرار] Like "*" & [Forms]![frmNavigation]![NavigationSubform].Form![status] & "*"
     OR [Forms]![frmNavigation]![NavigationSubform].Form![status] Is Null)

AND (القرارات.[وصف المبنى] Like "*" & [Forms]![frmNavigation]![NavigationSubform].Form![build_description] & "*"
     OR [Forms]![frmNavigation]![NavigationSubform].Form![build_description] Is Null)

AND (القرارات.العنوان Like "*" & [Forms]![frmNavigation]![NavigationSubform].Form![address] & "*"
     OR [Forms]![frmNavigation]![NavigationSubform].Form![address] Is Null)

AND (القرارات.[الاجراءات المنخذه] Like "*" & [Forms]![frmNavigation]![NavigationSubform].Form![taken_procedures] & "*"
     OR [Forms]![frmNavigation]![NavigationSubform].Form![taken_procedures] Is Null)

AND (القرارات.[موقف المرافق] Like "*" & [Forms]![frmNavigation]![NavigationSubform].Form![attatch] & "*"
     OR [Forms]![frmNavigation]![NavigationSubform].Form![attatch] Is Null)

AND (القرارات.[حالة الاشغال] Like "*" & [Forms]![frmNavigation]![NavigationSubform].Form![occupied] & "*"
     OR [Forms]![frmNavigation]![NavigationSubform].Form![occupied] Is Null)

AND (القرارات.[سبب عدم  التنفيذ] Like "*" & [Forms]![frmNavigation]![NavigationSubform].Form![why] & "*"
     OR [Forms]![frmNavigation]![NavigationSubform].Form![why] Is Null);
